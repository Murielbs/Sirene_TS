import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ResponseUtils } from '../utils/response';
import { AuthRequest, LoginRequest, CriarMilitarRequest } from '../types';

export class AuthController {
  /**
   * POST /auth/recuperar-senha
   * Solicita recuperação de senha informando matrícula e CPF
   */
  static async solicitarRecuperacaoSenha(req: Request, res: Response): Promise<void> {
    const { matricula, cpf } = req.body;
    if (!matricula || !cpf) {
      res.status(400).json(ResponseUtils.error('Matrícula e CPF são obrigatórios'));
      return;
    }
    try {
      const militar = await AuthService.buscarPorMatriculaECpf(matricula, cpf);
      if (!militar) {
        res.status(404).json(ResponseUtils.error('Dados não encontrados ou inválidos'));
        return;
      }
      res.json(ResponseUtils.success('Dados validados. Prossiga para redefinir a senha.', { id: militar.id }));
    } catch (error: any) {
      res.status(400).json(ResponseUtils.error('Erro ao validar dados', error.message));
    }
  }

  /**
   * POST /auth/redefinir-senha
   * Redefine a senha do militar
   */
  static async redefinirSenha(req: Request, res: Response): Promise<void> {
    const { id, novaSenha, confirmarSenha } = req.body;
    if (!id || !novaSenha || !confirmarSenha) {
      res.status(400).json(ResponseUtils.error('Todos os campos são obrigatórios'));
      return;
    }
    if (novaSenha !== confirmarSenha) {
      res.status(400).json(ResponseUtils.error('As senhas não conferem'));
      return;
    }
    try {
      await AuthService.redefinirSenha(id, novaSenha);
      res.json(ResponseUtils.success('Senha redefinida com sucesso'));
    } catch (error: any) {
      res.status(400).json(ResponseUtils.error('Erro ao redefinir senha', error.message));
    }
  }
  /**
   * POST /auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;

      if (!loginData.matricula || !loginData.senha) {
        res.status(400).json(ResponseUtils.error('Matrícula e senha são obrigatórios'));
        return;
      }

      const resultado = await AuthService.login(loginData);
      res.json(ResponseUtils.success('Login realizado com sucesso', resultado));
    } catch (error: any) {
      res.status(401).json(ResponseUtils.error('Erro no login', error.message));
    }
  }

  /**
   * POST /auth/militar (apenas admin)
   */
  static async criarMilitar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const dadosMilitar: CriarMilitarRequest = req.body;

      const novoMilitar = await AuthService.criarMilitar(dadosMilitar);
      res.status(201).json(ResponseUtils.success('Militar criado com sucesso', novoMilitar));
    } catch (error: any) {
      res.status(400).json(ResponseUtils.error('Erro ao criar militar', error.message));
    }
  }

  /**
   * GET /auth/militares (admin e comandante)
   */
  static async listarMilitares(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const resultado = await AuthService.listarMilitares(page, limit);
      res.json(ResponseUtils.success('Militares listados com sucesso', resultado));
    } catch (error: any) {
      res.status(500).json(ResponseUtils.error('Erro ao listar militares', error.message));
    }
  }

  /**
   * GET /auth/militar/:id
   */
  static async buscarMilitar(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json(ResponseUtils.error('ID é obrigatório'));
        return;
      }

      const militar = await AuthService.buscarMilitarPorId(id);
      res.json(ResponseUtils.success('Militar encontrado', militar));
    } catch (error: any) {
      res.status(404).json(ResponseUtils.error('Militar não encontrado', error.message));
    }
  }

  /**
   * PUT /auth/militar/:id
   */
  static async atualizarMilitar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json(ResponseUtils.error('ID é obrigatório'));
        return;
      }

      const dados = req.body;

      const militarAtualizado = await AuthService.atualizarMilitar(id, dados);
      res.json(ResponseUtils.success('Militar atualizado com sucesso', militarAtualizado));
    } catch (error: any) {
      res.status(400).json(ResponseUtils.error('Erro ao atualizar militar', error.message));
    }
  }

  /**
   * DELETE /auth/militar/:id (apenas admin)
   */
  static async removerMilitar(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json(ResponseUtils.error('ID é obrigatório'));
        return;
      }

      await AuthService.removerMilitar(id);
      res.json(ResponseUtils.success('Militar removido com sucesso'));
    } catch (error: any) {
      res.status(400).json(ResponseUtils.error('Erro ao remover militar', error.message));
    }
  }

  /**
   * GET /auth/me - Dados do usuário logado
   */
  static async dadosUsuario(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.militar) {
        res.status(401).json(ResponseUtils.error('Usuário não autenticado'));
        return;
      }

      res.json(ResponseUtils.success('Dados do usuário', req.militar));
    } catch (error: any) {
      res.status(500).json(ResponseUtils.error('Erro ao buscar dados do usuário', error.message));
    }
  }
}