import { Request, Response } from 'express';
import prisma from '../database/prisma';

export const OcorrenciaController = {
  async criarOcorrencia(req: Request, res: Response) {
    try {
      const {
        tipoOcorrencia,
        descricao,
        cidade,
        bairro,
        localizacaoGps,
        status,
        // novos campos
        prioridade,
        endereco,
        numero,
        regiao,
        pontoReferencia,
      } = req.body;

      const novaOcorrencia = await prisma.ocorrencia.create({
        data: {
          tipoOcorrencia,
          descricao,
          cidade,
          bairro,
          localizacaoGps,
          status,
          dataHora: new Date(),
          // persistir novos campos
          prioridade,
          endereco,
          numero,
          regiao,
          pontoReferencia,
        },
      });

      res.status(201).json(novaOcorrencia);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao criar ocorrência', error });
    }
  },
  async listarOcorrencias(req: Request, res: Response) {
    try {
      const ocorrencias = await prisma.ocorrencia.findMany({
        include: {
          registrosOcorrencia: {
            include: { militar: true },
            orderBy: { dataRegistro: 'desc' },
          },
        },
      });

      // mapear criadoPor (nome do primeiro militar do registro, se existir)
      const mapped = ocorrencias.map((o) => ({
        ...o,
        criadoPor:
          Array.isArray(o.registrosOcorrencia) && o.registrosOcorrencia.length > 0
            ? (o.registrosOcorrencia[0]?.militar?.nome ?? null)
            : null,
      }));

      res.json(mapped);
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
      const ocorrencia = await prisma.ocorrencia.findUnique({
        where: { id },
        include: { registrosOcorrencia: { include: { militar: true } } },
      });
      if (!ocorrencia) {
        res.status(404).json({ error: 'Ocorrência não encontrada' });
        return;
      }
      const mapped = {
        ...ocorrencia,
        criadoPor:
          Array.isArray(ocorrencia.registrosOcorrencia) && ocorrencia.registrosOcorrencia.length > 0
            ? (ocorrencia.registrosOcorrencia[0]?.militar?.nome ?? null)
            : null,
      };
      res.json(mapped);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao buscar ocorrência', error });
    }
  },
  async atualizarOcorrencia(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      // Campos permitidos para update
      const {
        tipoOcorrencia,
        descricao,
        cidade,
        bairro,
        localizacaoGps,
        status,
        prioridade,
        endereco,
        numero,
        regiao,
        pontoReferencia,
      } = req.body;

      const dadosParaAtualizar: any = {};
      if (tipoOcorrencia !== undefined) dadosParaAtualizar.tipoOcorrencia = tipoOcorrencia;
      if (descricao !== undefined) dadosParaAtualizar.descricao = descricao;
      if (cidade !== undefined) dadosParaAtualizar.cidade = cidade;
      if (bairro !== undefined) dadosParaAtualizar.bairro = bairro;
      if (localizacaoGps !== undefined) dadosParaAtualizar.localizacaoGps = localizacaoGps;
      if (status !== undefined) dadosParaAtualizar.status = status;
      if (prioridade !== undefined) dadosParaAtualizar.prioridade = prioridade;
      if (endereco !== undefined) dadosParaAtualizar.endereco = endereco;
      if (numero !== undefined) dadosParaAtualizar.numero = numero;
      if (regiao !== undefined) dadosParaAtualizar.regiao = regiao;
      if (pontoReferencia !== undefined) dadosParaAtualizar.pontoReferencia = pontoReferencia;

      const ocorrenciaAtualizada = await prisma.ocorrencia.update({
        where: { id },
        data: dadosParaAtualizar,
      });

      res.json(ocorrenciaAtualizada);
    } catch (error) {
      // Prisma throws when not found; map to 404
      if (String(error).includes('Record to update not found')) {
        res.status(404).json({ error: 'Ocorrência não encontrada' });
        return;
      }
      res.status(500).json({ success: false, message: 'Erro ao atualizar ocorrência', error });
    }
  }
};
