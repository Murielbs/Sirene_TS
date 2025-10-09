import { Request, Response } from 'express';
import { RegistroOcorrenciaService } from '../services/RegistroOcorrenciaService';

export class RegistroOcorrenciaController {
  static async criarRegistro(req: Request, res: Response): Promise<void> {
    try {
      const registro = await RegistroOcorrenciaService.criarRegistro(req.body);
      res.status(201).json(registro);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar registro', details: error });
    }
  }

  static async listarRegistros(req: Request, res: Response): Promise<void> {
    try {
      const registros = await RegistroOcorrenciaService.listarRegistros();
      res.json(registros);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar registros', details: error });
    }
  }

  static async buscarRegistroPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const registro = await RegistroOcorrenciaService.buscarRegistroPorId(id);
      if (!registro) {
        res.status(404).json({ error: 'Registro não encontrado' });
        return;
      }
      res.json(registro);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar registro', details: error });
      return;
    }
  }

  static async atualizarRegistro(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const registro = await RegistroOcorrenciaService.atualizarRegistro(id, req.body);
      res.json(registro);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar registro', details: error });
    }
  }

  static async removerRegistro(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      await RegistroOcorrenciaService.removerRegistro(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Erro ao remover registro', details: error });
    }
  }
}
