import { Request, Response } from 'express';
import prisma from '../database/prisma';

export const OcorrenciaController = {
  async criarOcorrencia(req: Request, res: Response) {
    console.log('OcorrenciaController.criarOcorrencia chamado');
    try {
      // Dados recebidos do body
      const {
        tipoOcorrencia,
        descricao,
        localizacaoGps,
        assinaturaDigital,
        fotoUrl,
        videoUrl
      } = req.body;

      // Preencher campos automáticos
      const dataHora = new Date();
      const status = 'Em andamento';

      // Cria ocorrência
      const ocorrencia = await prisma.ocorrencia.create({
        data: {
          dataHora,
          tipoOcorrencia,
          descricao,
          localizacaoGps,
          status,
          assinaturaDigital,
          fotoUrl,
          videoUrl
        }
      });
      console.log('Ocorrencia criada:', ocorrencia);

      // Pega o id do militar autenticado do token
      const militarId = (req as any).militar?.id;

      // Cria registro de ocorrência
      const registro = await prisma.registroOcorrencia.create({
        data: {
          idOcorrencia: ocorrencia.id,
          idMilitar: militarId,
          // idEquipe pode ser preenchido se disponível
          dataRegistro: new Date(),
          observacoes: `Ocorrência criada pelo endpoint.`
        }
      });
      console.log('RegistroOcorrencia criado:', registro);

      return res.status(201).json({ success: true, ocorrencia });
    } catch (error) {
      let errorMsg = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      console.error('Erro ao criar ocorrência:', error);
      return res.status(500).json({ success: false, message: 'Erro ao criar ocorrência', error: errorMsg });
    }
  }
};
