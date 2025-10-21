
//Define as rotas da aplicação
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { OcorrenciaController } from '../controllers/OcorrenciaController';
import { 
  authenticateToken, 
  adminOnly, 
  adminOrCommander, 
  auditLog 
} from '../middleware/auth';
import { loginRateLimiter } from '../middleware/general';

const router = Router();
/**
 * @route POST /auth/recuperar-senha
 * @desc Solicita recuperação de senha
 * @access Public
 */
router.post('/recuperar-senha', AuthController.solicitarRecuperacaoSenha);

/**
 * @route POST /auth/redefinir-senha
 * @desc Redefine a senha do militar
 * @access Public
 */
router.post('/redefinir-senha', AuthController.redefinirSenha);

/**
 * @route POST /auth/login
 * @desc Login do militar
 * @access Public
 */
router.post('/login', loginRateLimiter, AuthController.login);

/**
 * @route GET /auth/me
 * @desc Dados do usuário logado
 * @access Private
 */
router.get('/me', authenticateToken, AuthController.dadosUsuario);

/**
 * @route POST /auth/militar
 * @desc Criar novo militar (apenas admin)
 * @access Private (Admin)
 */
router.post(
  '/militar',
  authenticateToken,
  adminOnly,
  auditLog('CRIAR_MILITAR'),
  AuthController.criarMilitar
);

/**
 * @route GET /auth/militares
 * @desc Listar militares (admin e comandante)
 * @access Private (Admin/Comandante)
 */
router.get(
  '/militares',
  authenticateToken,
  adminOrCommander,
  AuthController.listarMilitares
);

/**
 * @route GET /auth/militar/:id
 * @desc Buscar militar por ID
 * @access Private
 */
router.get(
  '/militar/:id',
  authenticateToken,
  AuthController.buscarMilitar
);

/**
 * @route PUT /auth/militar/:id
 * @desc Atualizar dados do militar
 * @access Private
 */
router.put(
  '/militar/:id',
  authenticateToken,
  auditLog('ATUALIZAR_MILITAR'),
  AuthController.atualizarMilitar
);

/**
 * @route DELETE /auth/militar/:id
 * @desc Remover militar (apenas admin)
 * @access Private (Admin)
 */
router.delete(
  '/militar/:id',
  authenticateToken,
  adminOnly,
  auditLog('REMOVER_MILITAR'),
  AuthController.removerMilitar
);

// Rotas de ocorrência
router.post('/Ocorrencia', OcorrenciaController.criarOcorrencia);
router.post('/ocorrencia', OcorrenciaController.criarOcorrencia);

export default router;
