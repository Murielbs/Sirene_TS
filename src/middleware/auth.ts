import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
import { ResponseUtils } from '../utils/response';
import { AuthRequest, PerfilAcesso } from '../types';
import prisma from '../database/prisma';


export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = AuthUtils.extractTokenFromHeader(req.get('Authorization'));

    if (!token) {
      res.status(401).json(ResponseUtils.error('Token não fornecido'));
      return;
    }

    const decoded = AuthUtils.verifyToken(token);
    
    // Busca dados atualizados do militar
    const militar = await prisma.militar.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nome: true,
        matricula: true,
        cpf: true,
        numeroMilitar: true,
        posto: true,
        perfilAcesso: true,
      },
    });

    if (!militar) {
      res.status(401).json(ResponseUtils.error('Militar não encontrado'));
      return;
    }

    req.militar = {
      id: militar.id,
      nome: militar.nome || '',
      matricula: militar.matricula || '',
      cpf: militar.cpf || '',
      numeroMilitar: militar.numeroMilitar || '',
      posto: militar.posto || '',
      perfilAcesso: militar.perfilAcesso as PerfilAcesso || PerfilAcesso.MILITAR,
    };

    next();
  } catch (error) {
    res.status(401).json(ResponseUtils.error('Token inválido'));
  }
};


 // Middleware de autorização por perfil
 
export const authorize = (perfisPermitidos: PerfilAcesso[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.militar) {
      res.status(401).json(ResponseUtils.error('Usuário não autenticado'));
      return;
    }

    if (!perfisPermitidos.includes(req.militar.perfilAcesso)) {
      res.status(403).json(ResponseUtils.error('Você não pode cadastrar, você não é admin!'));
      return;
    }

    next();
  };
};


  // Middleware apenas para administradores
 
export const adminOnly = authorize([PerfilAcesso.ADMIN]);


 // Middleware para administradores e comandantes
 
export const adminOrCommander = authorize([PerfilAcesso.ADMIN, PerfilAcesso.COMANDANTE]);


 // Middleware de log de auditoria

export const auditLog = (acao: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.militar) {
        await prisma.logAuditoria.create({
          data: {
            idMilitar: req.militar.id,
            acao: `${acao} - ${req.method} ${req.url}`,
            dataHora: new Date(),
            ipOrigem: req.socket?.remoteAddress || 'unknown',
          },
        });
      }
      next();
    } catch (error) {
      console.error('Erro ao registrar log de auditoria:', error);
      next(); // Continua mesmo se o log falhar
    }
  };
};