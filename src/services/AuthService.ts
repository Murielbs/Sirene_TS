// Aqui ficam as regras de funcionamento
import prisma from '../database/prisma';
import { AuthUtils, ValidationUtils } from '../utils/auth';
import { 
  LoginRequest, 
  LoginResponse, 
  CriarMilitarRequest, 
  PerfilAcesso 
} from '../types';

export class AuthService {
  // Busca militar por matrícula e CPF
  static async buscarPorMatriculaECpf(matricula: string, cpf: string) {
    return prisma.militar.findFirst({
      where: { matricula, cpf },
      select: {
        id: true,
        nome: true,
        matricula: true,
        cpf: true,
        numeroMilitar: true,
        email: true,
      },
    });
  }

  // Redefine a senha do militar
  static async redefinirSenha(id: string, novaSenha: string) {
    const senhaHash = await AuthUtils.hashPassword(novaSenha);
    return prisma.militar.update({
      where: { id },
      data: { senhaHash },
    });
  }
  
    // Realiza login do militar
   
  static async login(loginData: LoginRequest): Promise<LoginResponse> {
    const { matricula, senha } = loginData;

    // Busca militar pela matrícula
    const militar = await prisma.militar.findUnique({
      where: { matricula },
      select: {
        id: true,
        nome: true,
        matricula: true,
        cpf: true,
        numeroMilitar: true,
        posto: true,
        senhaHash: true,
        perfilAcesso: true,
      },
    });

    if (!militar || !militar.senhaHash) {
      throw new Error('Credenciais inválidas');
    }

    // Verifica senha
    const senhaValida = await AuthUtils.verifyPassword(senha, militar.senhaHash);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    // Gera token
    const token = AuthUtils.generateToken({
      id: militar.id,
      matricula: militar.matricula!,
      perfilAcesso: militar.perfilAcesso as PerfilAcesso,
    });

    return {
      token,
      militar: {
        id: militar.id,
        nome: militar.nome || '',
        matricula: militar.matricula || '',
        cpf: militar.cpf || '',
        numeroMilitar: militar.numeroMilitar || '',
        posto: militar.posto || '',
        perfilAcesso: militar.perfilAcesso as PerfilAcesso,
      },
    };
  }

  
   // Cadastra novo militar (apenas admin pode fazer isso)
   
  static async criarMilitar(dadosMilitar: CriarMilitarRequest) {
    const { nome, cpf, numeroMilitar, posto, email, senha, perfilAcesso } = dadosMilitar;
    // Validações
    if (!ValidationUtils.isValidEmail(email)) {
      throw new Error('Formato de email inválido');
    }
    if (!ValidationUtils.isStrongPassword(senha)) {
      throw new Error('Senha deve ter no mínimo 8 caracteres com pelo menos 1 maiúscula, 1 minúscula e 1 número');
    }
    // Verifica se email já existe
    const emailExistente = await prisma.militar.findFirst({
      where: { email },
    });
    if (emailExistente) {
      throw new Error('Email já cadastrado');
    }
    // Busca o último número de matrícula para o perfil
    const ultimoMilitar = await prisma.militar.findMany({
      where: { perfilAcesso },
      orderBy: { matricula: 'desc' },
      select: { matricula: true },
    });
    let ultimoNumero = 0;
    if (ultimoMilitar.length > 0) {
  const matriculaUltima = ultimoMilitar[0]?.matricula ?? '';
      if (matriculaUltima) {
        // Extrai apenas o número sequencial após o ano 2025
        const regex = /2025(\d+)$/;
        const match = matriculaUltima.match(regex);
        if (match && match[1]) {
          ultimoNumero = parseInt(match[1], 10);
        }
      }
    }
    // Gera matrícula automática
    const { gerarMatricula } = await import('../utils/matricula');
    const matricula = gerarMatricula(perfilAcesso, ultimoNumero);
    // Verifica se matrícula já existe
    const militarExistente = await prisma.militar.findUnique({
      where: { matricula },
    });
    if (militarExistente) {
      throw new Error('Matrícula já cadastrada');
    }
    // Cria hash da senha
    const senhaHash = await AuthUtils.hashPassword(senha);
    // Cria militar
    const novoMilitar = await prisma.militar.create({
      data: {
        nome: ValidationUtils.sanitizeString(nome),
        matricula,
        cpf,
        numeroMilitar,
        posto: ValidationUtils.sanitizeString(posto),
        email,
        senhaHash,
        perfilAcesso,
      },
      select: {
        id: true,
        nome: true,
        matricula: true,
        cpf: true,
        numeroMilitar: true,
        posto: true,
        email: true,
        perfilAcesso: true,
      },
    });
    return novoMilitar;
  }

  
  // Lista todos os militares (apenas admin e comandante)
   
  static async listarMilitares(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [militares, total] = await Promise.all([
      prisma.militar.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          nome: true,
          matricula: true,
          cpf: true,
          numeroMilitar: true,
          posto: true,
          email: true,
          perfilAcesso: true,
        },
        orderBy: { nome: 'asc' },
      }),
      prisma.militar.count(),
    ]);

    return {
      militares,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  
   // Busca militar por ID
   
  static async buscarMilitarPorId(id: string) {
    const militar = await prisma.militar.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        matricula: true,
        cpf: true,
        numeroMilitar: true,
        posto: true,
        email: true,
        perfilAcesso: true,
      },
    });

    if (!militar) {
      throw new Error('Militar não encontrado');
    }

    return militar;
  }

  
  // Atualiza dados do militar
   
  static async atualizarMilitar(id: string, dados: Partial<CriarMilitarRequest>) {
    const { nome, cpf, numeroMilitar, posto, email, senha } = dados;

    const dadosAtualizacao: any = {};

    if (nome) {
      dadosAtualizacao.nome = ValidationUtils.sanitizeString(nome);
    }
    if (cpf) {
      dadosAtualizacao.cpf = cpf;
    }
    if (numeroMilitar) {
      dadosAtualizacao.numeroMilitar = numeroMilitar;
    }

    if (posto) {
      dadosAtualizacao.posto = ValidationUtils.sanitizeString(posto);
    }

    if (email) {
      if (!ValidationUtils.isValidEmail(email)) {
        throw new Error('Formato de email inválido');
      }

      // Verifica se email já existe em outro militar
      const emailExistente = await prisma.militar.findFirst({
        where: { 
          email,
          NOT: { id },
        },
      });

      if (emailExistente) {
        throw new Error('Email já cadastrado para outro militar');
      }

      dadosAtualizacao.email = email;
    }

    if (senha) {
      if (!ValidationUtils.isStrongPassword(senha)) {
        throw new Error('Senha deve ter no mínimo 8 caracteres com pelo menos 1 maiúscula, 1 minúscula e 1 número');
      }
      dadosAtualizacao.senhaHash = await AuthUtils.hashPassword(senha);
    }

    const militarAtualizado = await prisma.militar.update({
      where: { id },
      data: dadosAtualizacao,
      select: {
        id: true,
        nome: true,
        matricula: true,
        cpf: true,
        numeroMilitar: true,
        posto: true,
        email: true,
        perfilAcesso: true,
      },
    });

    return militarAtualizado;
  }

  
   // Remove militar (apenas admin)
   
  static async removerMilitar(id: string) {
    // Verifica se militar existe
    await this.buscarMilitarPorId(id);

    // Remove militar (Prisma cuidará das foreign keys com cascade)
    await prisma.militar.delete({
      where: { id },
    });

    return { message: 'Militar removido com sucesso' };
  }
}