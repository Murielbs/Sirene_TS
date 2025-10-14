// Tipos do Sistema Corpo de Bombeiros
import { Request } from 'express';

export interface AuthRequest extends Request {
  militar?: {
    id: string;
    nome: string;
    matricula: string;
    cpf: string;
    numeroMilitar: string;
    posto: string;
    perfilAcesso: PerfilAcesso;
  };
}

export enum PerfilAcesso {
  ADMIN = 'ADMIN',
  COMANDANTE = 'COMANDANTE',
  MILITAR = 'MILITAR'
}

export enum StatusOcorrencia {
  ABERTA = 'ABERTA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export enum TipoOcorrencia {
  INCENDIO = 'INCENDIO',
  ACIDENTE = 'ACIDENTE',
  RESGATE = 'RESGATE',
  EMERGENCIA_MEDICA = 'EMERGENCIA_MEDICA',
  VAZAMENTO = 'VAZAMENTO',
  OUTROS = 'OUTROS'
}

export interface LoginRequest {
  matricula: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  militar: {
    id: string;
    nome: string;
    matricula: string;
    cpf: string;
    numeroMilitar: string;
    posto: string;
    perfilAcesso: PerfilAcesso;
  };
}

export interface CriarMilitarRequest {
  nome: string;
  matricula: string;
  cpf: string;
  numeroMilitar: string;
  posto: string;
  email: string;
  senha: string;
  perfilAcesso: PerfilAcesso;
}

export interface CriarOcorrenciaRequest {
  tipoOcorrencia: TipoOcorrencia;
  descricao: string;
  localizacaoGps: string;
  modoTreinamento?: boolean;
}

export interface AtualizarOcorrenciaRequest {
  status?: StatusOcorrencia;
  descricao?: string;
  observacoes?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface OcorrenciaFilters extends PaginationQuery {
  tipoOcorrencia?: TipoOcorrencia;
  status?: StatusOcorrencia;
  dataInicio?: string;
  dataFim?: string;
  modoTreinamento?: boolean;
}