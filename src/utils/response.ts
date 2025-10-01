export class ResponseUtils {
  /**
   * Utilitário para padronizar respostas JSON de sucesso
   */
  static success<T>(message: string, data?: T) {
    return { success: true, message, data };
  }

  /**
   * Utilitário para padronizar respostas JSON de erro
   */
  static error(message: string, error?: any) {
    return { success: false, message, error };
  }
}
