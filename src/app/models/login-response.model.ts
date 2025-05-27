import { User } from './user.model';

export interface LoginResponse {
  mensaje: string;
  usuario: User;
  token: string;
}
export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface ApiResponse<T> {
  codigoRespuesta: string;
  mensajeRespuesta: string;
  objeto: T;
}
