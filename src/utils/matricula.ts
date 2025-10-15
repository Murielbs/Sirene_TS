import { PerfilAcesso } from '../types';

export function gerarMatricula(perfil: PerfilAcesso, ultimoNumero: number): string {
  let prefixo = '';
  switch (perfil) {
    case PerfilAcesso.ADMIN:
      prefixo = 'ADM';
      break;
    case PerfilAcesso.COMANDANTE:
      prefixo = 'COM';
      break;
    case PerfilAcesso.MILITAR:
      prefixo = 'MIL';
      break;
    default:
      prefixo = 'USR';
  }
  return `${prefixo}2025${ultimoNumero + 1}`;
}
