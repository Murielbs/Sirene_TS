import prisma from '../database/prisma';

export const RelatorioService = {
  async listarRelatorios() {
    return prisma.relatorio.findMany({
      include: {
        ocorrencia: true,
        militar: true
      }
    });
  },

  async criarRelatorio(data: {
    idOcorrencia: string;
    geradoPor: string;
    formato: string;
    urlArquivo: string;
  }) {
    return prisma.relatorio.create({
      data: {
        ...data,
        dataGeracao: new Date()
      }
    });
  },

  async buscarRelatorioPorId(id: string) {
    return prisma.relatorio.findUnique({
      where: { id },
      include: {
        ocorrencia: true,
        militar: true
      }
    });
  }
};
