import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Importar middlewares
import { errorHandler, rateLimiter, requestLogger } from './middleware/general';

// Importar rotas
import authRoutes from './routes/auth';
import ocorrenciaRoutes from './routes/ocorrencia';
import relatorioRoutes from './routes/relatorio';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate limiting global
app.use(rateLimiter);

// Log de requisições
app.use(requestLogger);

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/ocorrencia', ocorrenciaRoutes);
app.use('/api/relatorio', relatorioRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema Corpo de Bombeiros - API Online',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Rota 404 - deve vir após todas as outras rotas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    path: req.url,
  });
});

// Middleware de tratamento de erros (deve vir por último)
app.use(errorHandler);



export default app;