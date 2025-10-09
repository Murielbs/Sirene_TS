export class ResponseUtils {
   // sucesso
  static success<T>(message: string, data?: T) {
    return { success: true, message, data };
  }

// erro
  static error(message: string, error?: any) {
    return { success: false, message, error };
  }
}
