import { Request, Response } from 'express';
import prisma from '../database/prisma';

export const RelatorioController = {
  // Lista todos os relatórios
  async listarRelatorios(req: Request, res: Response) {
    try {
      const relatorios = await prisma.relatorio.findMany({
        include: {
          ocorrencia: true,
          militar: true
        }
      });
      return res.status(200).json(relatorios);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar relatórios', error });
    }
  },

  // Cria um novo relatório
  async criarRelatorio(req: Request, res: Response) {
    try {
      const { idOcorrencia, formato, urlArquivo } = req.body;
      // Pega o id do militar autenticado do token
      const militarId = (req as any).militar?.id;
      if (!militarId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
      }
      const dataGeracao = new Date();
      const relatorio = await prisma.relatorio.create({
        data: {
          idOcorrencia,
          geradoPor: militarId,
          dataGeracao,
          formato,
          urlArquivo
        }
      });
      return res.status(201).json({ success: true, relatorio });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erro ao criar relatório', error });
    }
  },

  // Busca relatório por ID
  async buscarRelatorioPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID do relatório não informado' });
      }
      const relatorio = await prisma.relatorio.findUnique({
        where: { id },
        include: {
          ocorrencia: true,
          militar: true
        }
      });
      if (!relatorio) {
        return res.status(404).json({ success: false, message: 'Relatório não encontrado' });
      }
      return res.status(200).json(relatorio);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar relatório', error });
    }
  }
};
