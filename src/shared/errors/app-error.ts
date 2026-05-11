/**
 * AppError — Shared Layer
 * 
 * Clase de error tipada para toda la aplicación.
 * Permite manejar errores con contexto sem profesional.
 */
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'
  | 'INVALID_STATE'
  | 'NETWORK_ERROR';

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: ErrorCode,
    public readonly statusCode: number = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }

  static fromUnknown(error: unknown): AppError {
    if (AppError.isAppError(error)) return error;
    if (error instanceof Error) {
      return new AppError(error.message, 'INTERNAL_ERROR', 500);
    }
    return new AppError('Ocurrió un error inesperado', 'INTERNAL_ERROR', 500);
  }
}
