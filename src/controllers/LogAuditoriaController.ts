import { Request, Response } from 'express';
import { LogAuditoriaService } from '../services/LogAuditoriaService';

export class LogAuditoriaController {
  static async criarLog(req: Request, res: Response): Promise<void> {
    try {
      const log = await LogAuditoriaService.criarLog(req.body);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar log', details: error });
    }
  }

  static async listarLogs(req: Request, res: Response): Promise<void> {
    try {
      const logs = await LogAuditoriaService.listarLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar logs', details: error });
    }
  }

  static async buscarLogPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const log = await LogAuditoriaService.buscarLogPorId(id);
      if (!log) {
        res.status(404).json({ error: 'Log não encontrado' });
        return;
      }
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar log', details: error });
      return;
    }
  }

  static async removerLog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      await LogAuditoriaService.removerLog(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Erro ao remover log', details: error });
    }
  }
}
