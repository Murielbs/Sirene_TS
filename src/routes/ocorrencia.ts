import { Router } from 'express';
import { OcorrenciaController } from '../controllers/OcorrenciaController';

const router = Router();

router.post('/', OcorrenciaController.criarOcorrencia);
// router.get('/', OcorrenciaController.listarOcorrencias);
// router.get('/:id', OcorrenciaController.buscarOcorrenciaPorId);

export default router;
