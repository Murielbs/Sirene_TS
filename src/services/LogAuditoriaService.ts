import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LogAuditoriaService {
  static async criarLog(data: any) {
    return prisma.logAuditoria.create({ data });
  }

  static async listarLogs() {
    return prisma.logAuditoria.findMany();
  }

  static async buscarLogPorId(id: string) {
    return prisma.logAuditoria.findUnique({ where: { id } });
  }

  static async removerLog(id: string) {
    return prisma.logAuditoria.delete({ where: { id } });
  }
}
