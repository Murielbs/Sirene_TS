import { Request, Response } from 'express';
import { EquipeService } from '../services/EquipeService';

export class EquipeController {
  static async criarEquipe(req: Request, res: Response): Promise<void> {
    try {
      const equipe = await EquipeService.criarEquipe(req.body);
      res.status(201).json(equipe);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar equipe', details: error });
    }
  }

  static async listarEquipes(req: Request, res: Response): Promise<void> {
    try {
      const equipes = await EquipeService.listarEquipes();
      res.json(equipes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar equipes', details: error });
    }
  }

  static async buscarEquipePorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const equipe = await EquipeService.buscarEquipePorId(id);
      if (!equipe) {
        res.status(404).json({ error: 'Equipe não encontrada' });
        return;
      }
      res.json(equipe);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar equipe', details: error });
      return;
    }
  }

  static async atualizarEquipe(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const equipe = await EquipeService.atualizarEquipe(id, req.body);
      res.json(equipe);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar equipe', details: error });
    }
  }

  static async removerEquipe(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      await EquipeService.removerEquipe(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Erro ao remover equipe', details: error });
    }
  }
}
