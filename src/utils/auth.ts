import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PerfilAcesso } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthUtils {
  
    // Gera hash da senha
   
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }


   // Verifica se a senha está correta
   
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  
   // Gera token JWT
   
  static generateToken(payload: {
    id: string;
    matricula: string;
    perfilAcesso: PerfilAcesso;
  }): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  
  //  Verifica e decodifica token JWT
   
  static verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }

  
   // Extrai token do header Authorization
  
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  
   // Utilitário para padronizar respostas JSON
   
  static success<T>(message: string, data?: T) {
    return { success: true, message, data };
  }

  static error(message: string, error?: any) {
    return { success: false, message, error };
  }
}


 // Validações diversas
 
export class ValidationUtils {
  
   // Valida formato de email
  
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  
   // Valida força da senha
  
  static isStrongPassword(password: string): boolean {
    // Mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 minúscula e 1 número
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  
  // Valida formato de matrícula

  static isValidMatricula(matricula: string): boolean {
    // Formato: letras e números, 6-20 caracteres
    const matriculaRegex = /^[A-Z0-9]{6,20}$/;
    return matriculaRegex.test(matricula.toUpperCase());
  }

  
  // Sanitiza string removendo caracteres especiais
  
  static sanitizeString(str: string): string {
    return str.trim().replace(/[<>]/g, '');
  }
}