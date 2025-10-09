import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EquipeService {
  static async criarEquipe(data: any) {
    return prisma.equipe.create({ data });
  }

  static async listarEquipes() {
    return prisma.equipe.findMany();
  }

  static async buscarEquipePorId(id: string) {
    return prisma.equipe.findUnique({ where: { id } });
  }

  static async atualizarEquipe(id: string, data: any) {
    return prisma.equipe.update({ where: { id }, data });
  }

  static async removerEquipe(id: string) {
    return prisma.equipe.delete({ where: { id } });
  }
}
