import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MilitarEquipeService {
  static async adicionarMilitarEquipe(data: any) {
    return prisma.militarEquipe.create({ data });
  }

  static async listarMilitarEquipes() {
    return prisma.militarEquipe.findMany();
  }

  static async buscarMilitarEquipePorId(id: string) {
    return prisma.militarEquipe.findUnique({ where: { id } });
  }

  static async removerMilitarEquipe(id: string) {
    return prisma.militarEquipe.delete({ where: { id } });
  }

  static async listarMilitaresPorEquipe(idEquipe: string) {
    return prisma.militarEquipe.findMany({ where: { idEquipe }, include: { militar: true } });
  }

  static async listarEquipesPorMilitar(idMilitar: string) {
    return prisma.militarEquipe.findMany({ where: { idMilitar }, include: { equipe: true } });
  }
}
