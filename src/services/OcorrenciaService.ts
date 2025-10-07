import prisma from '../database/prisma';

export const OcorrenciaService = {
  async criarOcorrencia(data: any) {
    // Preencher campos automáticos
    const dataHora = new Date();
    const status = 'Em andamento';

    // Cria ocorrência
    const ocorrencia = await prisma.ocorrencia.create({
      data: {
        ...data,
        dataHora,
        status
      }
    });

    // Cria registro de ocorrência
    await prisma.registroOcorrencia.create({
      data: {
        idOcorrencia: ocorrencia.id,
        // idMilitar e idEquipe podem ser preenchidos se disponíveis
        dataRegistro: new Date(),
        observacoes: `Ocorrência criada pelo endpoint.`
      }
    });

    return ocorrencia;
  }
};
