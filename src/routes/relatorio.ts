import { Router } from 'express';
import { RelatorioController } from '../controllers/RelatorioController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', RelatorioController.listarRelatorios);
router.post('/', authenticateToken, RelatorioController.criarRelatorio);
router.get('/:id', RelatorioController.buscarRelatorioPorId);

export default router;
