import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { ResponseUtils } from '../utils/response';

/**
 * Middleware de rate limiting
 */
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: ResponseUtils.error('Muitas tentativas. Tente novamente mais tarde.'),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting mais restritivo para login
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por IP
  message: ResponseUtils.error('Muitas tentativas de login. Tente novamente em 15 minutos.'),
  skipSuccessfulRequests: true,
});

/**
 * Middleware de log de requisições
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.socket?.remoteAddress || 'unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
};

/**
 * Middleware de tratamento de erros
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Erro capturado:', error);

  // Erro de validação do Prisma
  if (error.code === 'P2002') {
    res.status(400).json(ResponseUtils.error('Dados duplicados', error.meta?.target));
    return;
  }

  // Erro de registro não encontrado do Prisma
  if (error.code === 'P2025') {
    res.status(404).json(ResponseUtils.error('Registro não encontrado'));
    return;
  }

  // Erro de token JWT
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json(ResponseUtils.error('Token inválido'));
    return;
  }

  // Erro de token expirado
  if (error.name === 'TokenExpiredError') {
    res.status(401).json(ResponseUtils.error('Token expirado'));
    return;
  }

  // Erro de upload de arquivo
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json(ResponseUtils.error('Arquivo muito grande'));
      return;
    }
    res.status(400).json(ResponseUtils.error('Erro no upload', error.message));
    return;
  }

  // Erro genérico
  res.status(500).json(ResponseUtils.error('Erro interno do servidor', error.message));
};

/**
 * Middleware de validação de dados
 */
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json(ResponseUtils.error('Dados inválidos', error.details[0].message));
      return;
    }
    next();
  };
};

/**
 * Configuração do multer para upload de arquivos
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Tipos permitidos
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/avi',
    'video/mov',
    'application/pdf',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB padrão
  },
});

/**
 * Middleware para rotas não encontradas
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(ResponseUtils.error('Rota não encontrada.'));
};

/**
 * Middleware para validar o modo de treinamento
 */
export const checkTrainingMode = (req: Request, res: Response, next: NextFunction): void => {
  const isTraining = req.body.modoTreinamento === true || req.query.modoTreinamento === 'true';
  
  if (isTraining && process.env.NODE_ENV !== 'development') {
    res.status(403).json(ResponseUtils.error('Modo de treinamento só é permitido em ambiente de desenvolvimento.'));
    return;
  }
  
  next();
};

/**
 * Middleware para validar dados de paginação
 */
export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
  const page = req.query.page ? parseInt(req.query.page as string) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

  if (page !== undefined && (isNaN(page) || page < 1)) {
    res.status(400).json(ResponseUtils.error('Parâmetro "page" inválido.'));
    return;
  }

  if (limit !== undefined && (isNaN(limit) || limit < 1 || limit > 100)) {
    res.status(400).json(ResponseUtils.error('Parâmetro "limit" inválido (deve ser entre 1 e 100).'));
    return;
  }

  next();
};