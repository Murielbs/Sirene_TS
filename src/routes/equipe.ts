import { Router } from 'express';
import { EquipeController } from '../controllers/EquipeController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Listar todas as equipes
router.get('/', authenticateToken, EquipeController.listarEquipes);

// Criar nova equipe
router.post('/', authenticateToken, EquipeController.criarEquipe);

// Buscar equipe por ID
router.get('/:id', authenticateToken, EquipeController.buscarEquipePorId);

// Atualizar equipe
router.put('/:id', authenticateToken, EquipeController.atualizarEquipe);

// Remover equipe
router.delete('/:id', authenticateToken, EquipeController.removerEquipe);

export default router;
