import { Router } from 'express';
import { MilitarEquipeController } from '../controllers/MilitarEquipeController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Listar todas as relações militar/equipe
router.get('/', authenticateToken, MilitarEquipeController.listarMilitarEquipes);

// Adicionar militar à equipe
router.post('/', authenticateToken, MilitarEquipeController.adicionarMilitarEquipe);

// Buscar relação por ID
router.get('/:id', authenticateToken, MilitarEquipeController.buscarMilitarEquipePorId);

// Remover relação
router.delete('/:id', authenticateToken, MilitarEquipeController.removerMilitarEquipe);

// Listar militares de uma equipe
router.get('/equipe/:idEquipe', authenticateToken, MilitarEquipeController.listarMilitaresPorEquipe);

// Listar equipes de um militar
router.get('/militar/:idMilitar', authenticateToken, MilitarEquipeController.listarEquipesPorMilitar);

export default router;
