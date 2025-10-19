import { Router, Request, Response } from 'express';
import { OcorrenciaController } from '../controllers/OcorrenciaController';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
	try {
		await OcorrenciaController.criarOcorrencia(req, res);
	} catch (error) {
		console.error('Erro ao criar ocorrência:', error);
		res.status(500).json({ erro: 'Erro interno ao criar ocorrência.' });
	}
});

router.get('/', async (req: Request, res: Response) => {
	try {
		await OcorrenciaController.listarOcorrencias(req, res);
	} catch (error) {
		console.error('Erro ao listar ocorrências:', error);
		res.status(500).json({ erro: 'Erro interno ao listar ocorrências.' });
	}
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		await OcorrenciaController.buscarOcorrenciaPorId(req, res);
	} catch (error) {
		console.error('Erro ao buscar ocorrência por ID:', error);
		res.status(500).json({ erro: 'Erro interno ao buscar ocorrência.' });
	}
});
router.put('/:id', async (req: Request, res: Response) => {
	try {
		await OcorrenciaController.atualizarOcorrencia(req, res);
	} catch (error) {
		console.error('Erro ao atualizar ocorrência:', error);
		res.status(500).json({ erro: 'Erro interno ao atualizar ocorrência.' });
	}
});

export default router;
