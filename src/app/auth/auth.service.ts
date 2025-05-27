import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { ApiResponse, LoginResponse, LoginRequest } from '../models/login-response.model';
import { RegisterDto } from '../models/register.model';
import { PersonaDto } from '../models/persona.model';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/auth-api/api/auth/Usuarios';
  private personaUrl = '/auth-api/api/auth';

  constructor(private http: HttpClient) { }

  // Login solo envía usuario y contrasena, pero usamos User completo por tipo
 login(payload: LoginRequest): Observable<ApiResponse<LoginResponse>> {
  console.log('Datos enviados:', payload);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  return this.http.post<ApiResponse<LoginResponse>>(
    `${this.apiUrl}/login`,
    payload,
    { headers }
  ).pipe(
    tap((res) => {
      console.log('Respuesta login:', res); // 👈 LOG para ver la respuesta completa
      if (res.codigoRespuesta === '1' && res.objeto) {
        const idPersona = res.objeto.usuario.idPersona?.idPersona;
        console.log('ID Persona extraído:', idPersona); // 👈 LOG para verificar el valor

        if (idPersona) {
          localStorage.setItem('token', res.objeto.token);
          localStorage.setItem('idPersona', idPersona.toString());
        } else {
          console.error('❌ idPersona no encontrado en la respuesta');
        }
      } else {
        console.error('❌ Login fallido o sin objeto en la respuesta');
      }
    })
  );
}

  register(registerData: RegisterDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData);
  }

  saveLogin(loginData: User): Observable<any> {
    return this.http.post<any>(this.apiUrl, loginData);
  }

  getPersonaById(idPersona: number) {
    return this.http.get<ApiResponse<PersonaDto>>(`${this.personaUrl}/persona/${idPersona}`);
  }

}
