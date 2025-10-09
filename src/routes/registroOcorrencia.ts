import { Router } from 'express';
import { RegistroOcorrenciaController } from '../controllers/RegistroOcorrenciaController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Listar todos os registros de ocorrência
router.get('/', authenticateToken, RegistroOcorrenciaController.listarRegistros);

// Criar novo registro de ocorrência
router.post('/', authenticateToken, RegistroOcorrenciaController.criarRegistro);

// Buscar registro por ID
router.get('/:id', authenticateToken, RegistroOcorrenciaController.buscarRegistroPorId);

// Atualizar registro
router.put('/:id', authenticateToken, RegistroOcorrenciaController.atualizarRegistro);

// Remover registro
router.delete('/:id', authenticateToken, RegistroOcorrenciaController.removerRegistro);

export default router;
