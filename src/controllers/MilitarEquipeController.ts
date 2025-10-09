import { Request, Response } from 'express';
import { MilitarEquipeService } from '../services/MilitarEquipeService';

export class MilitarEquipeController {
  static async adicionarMilitarEquipe(req: Request, res: Response): Promise<void> {
    try {
      const relacao = await MilitarEquipeService.adicionarMilitarEquipe(req.body);
      res.status(201).json(relacao);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao adicionar militar à equipe', details: error });
    }
  }

  static async listarMilitarEquipes(req: Request, res: Response): Promise<void> {
    try {
      const relacoes = await MilitarEquipeService.listarMilitarEquipes();
      res.json(relacoes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar relações', details: error });
    }
  }

  static async buscarMilitarEquipePorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const relacao = await MilitarEquipeService.buscarMilitarEquipePorId(id);
      if (!relacao) {
        res.status(404).json({ error: 'Relação não encontrada' });
        return;
      }
      res.json(relacao);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar relação', details: error });
      return;
    }
  }

  static async removerMilitarEquipe(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      await MilitarEquipeService.removerMilitarEquipe(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Erro ao remover relação', details: error });
    }
  }

  static async listarMilitaresPorEquipe(req: Request, res: Response): Promise<void> {
    try {
      const { idEquipe } = req.params;
      if (!idEquipe || typeof idEquipe !== 'string') {
        res.status(400).json({ error: 'ID da equipe inválido' });
        return;
      }
      const militares = await MilitarEquipeService.listarMilitaresPorEquipe(idEquipe);
      res.json(militares);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar militares da equipe', details: error });
    }
  }

  static async listarEquipesPorMilitar(req: Request, res: Response): Promise<void> {
    try {
      const { idMilitar } = req.params;
      if (!idMilitar || typeof idMilitar !== 'string') {
        res.status(400).json({ error: 'ID do militar inválido' });
        return;
      }
      const equipes = await MilitarEquipeService.listarEquipesPorMilitar(idMilitar);
      res.json(equipes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar equipes do militar', details: error });
    }
  }
}
