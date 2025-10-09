import { Router } from 'express';
import { LogAuditoriaController } from '../controllers/LogAuditoriaController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Listar todos os logs de auditoria
router.get('/', authenticateToken, LogAuditoriaController.listarLogs);

// Criar novo log de auditoria
router.post('/', authenticateToken, LogAuditoriaController.criarLog);

// Buscar log por ID
router.get('/:id', authenticateToken, LogAuditoriaController.buscarLogPorId);

// Remover log
router.delete('/:id', authenticateToken, LogAuditoriaController.removerLog);

export default router;
