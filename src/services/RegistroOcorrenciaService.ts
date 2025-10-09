import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RegistroOcorrenciaService {
  static async criarRegistro(data: any) {
    return prisma.registroOcorrencia.create({ data });
  }

  static async listarRegistros() {
    return prisma.registroOcorrencia.findMany();
  }

  static async buscarRegistroPorId(id: string) {
    return prisma.registroOcorrencia.findUnique({ where: { id } });
  }

  static async atualizarRegistro(id: string, data: any) {
    return prisma.registroOcorrencia.update({ where: { id }, data });
  }

  static async removerRegistro(id: string) {
    return prisma.registroOcorrencia.delete({ where: { id } });
  }
}
