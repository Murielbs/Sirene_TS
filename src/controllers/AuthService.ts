
import prisma from '../database/prisma';
import { AuthUtils } from '../utils/auth';
import { PerfilAcesso, LoginRequest, CriarMilitarRequest } from '../types';

interface Militar {
    id: string;
    nome?: string | null;
    matricula?: string | null;
    email?: string | null;
    senhaHash?: string | null;
    perfilAcesso?: PerfilAcesso | string | null;
    cpf?: string | null;
}

interface LoginResult {
    token: string;
    user: {
        nome: string;
        cargo: PerfilAcesso | string;
    }
}


export class AuthService {
    
    static async login(loginData: LoginRequest): Promise<LoginResult> {
        const militar = await prisma.militar.findUnique({
            where: { matricula: loginData.matricula },
        });

        if (!militar) {
            throw new Error('Matrícula ou senha inválida.');
        }

    const senhaValida = await AuthUtils.verifyPassword(loginData.senha, militar.senhaHash || '');

        if (!senhaValida) {
            throw new Error('Matrícula ou senha inválida.');
        }

        // construir payload conforme AuthUtils.generateToken espera: { id, matricula, perfilAcesso }
        const payload = {
            id: militar.id,
            matricula: militar.matricula || '',
            perfilAcesso: (militar.perfilAcesso as PerfilAcesso) || PerfilAcesso.MILITAR,
        };

        const token = AuthUtils.generateToken(payload);

        return {
            token,
            user: {
                nome: militar.nome || '',
                cargo: militar.perfilAcesso || PerfilAcesso.MILITAR,
            }
        };
    }

    static async buscarPorMatriculaECpf(matricula: string, cpf: string): Promise<Militar | null> {
        const militar = await prisma.militar.findFirst({
            where: { matricula, cpf },
        });
        return militar as Militar | null;
    }

    static async redefinirSenha(id: string, novaSenha: string): Promise<void> {
        const senhaHash = await AuthUtils.hashPassword(novaSenha);
        await prisma.militar.update({
            where: { id },
            data: { senhaHash },
        });
    }

    static async criarMilitar(dadosMilitar: CriarMilitarRequest): Promise<Militar> {
        const senhaHash = await AuthUtils.hashPassword(dadosMilitar.senha);
        const novoMilitar = await prisma.militar.create({
            data: {
                ...dadosMilitar,
                senhaHash,
            },
        });
        return novoMilitar as Militar;
    }

    static async listarMilitares(page: number, limit: number): Promise<{ militares: Militar[], total: number }> {
        const militares = await prisma.militar.findMany({
            skip: (page - 1) * limit,
            take: limit,
        });
        const total = await prisma.militar.count();
        return { militares: militares as Militar[], total };
    }

    static async buscarMilitarPorId(id: string): Promise<Militar> {
        const militar = await prisma.militar.findUnique({
            where: { id },
        });
        if (!militar) {
            throw new Error('Militar não encontrado');
        }
        return militar as Militar;
    }

    static async atualizarMilitar(id: string, dados: any): Promise<Militar> {
        const militarAtualizado = await prisma.militar.update({
            where: { id },
            data: dados,
        });
        return militarAtualizado as Militar;
    }

    static async removerMilitar(id: string): Promise<void> {
        await prisma.militar.delete({
            where: { id },
        });
    }
}