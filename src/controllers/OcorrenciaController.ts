import { Request, Response } from 'express';
import prisma from '../database/prisma';

export const OcorrenciaController = {
  async criarOcorrencia(req: Request, res: Response) {

  },
  async listarOcorrencias(req: Request, res: Response) {
    try {
      const ocorrencias = await prisma.ocorrencia.findMany();
      res.json(ocorrencias);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao listar ocorrências', error });
    }
  },
  async buscarOcorrenciaPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const ocorrencia = await prisma.ocorrencia.findUnique({ where: { id } });
      if (!ocorrencia) {
        res.status(404).json({ error: 'Ocorrência não encontrada' });
        return;
      }
      res.json(ocorrencia);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao buscar ocorrência', error });
    }
  }
};
