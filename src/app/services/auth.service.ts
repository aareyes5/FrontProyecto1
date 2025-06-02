import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, ApiResponse } from '../models/login-response.model';
import { RegisterDto } from '../models/register.model';
import { PersonaDto } from '../models/persona.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUsuariosUrl = environment.apiUrls.usuarios;
  private apiPersonaUrl = environment.apiUrls.login;

  constructor(private http: HttpClient) { }

  login(payload: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUsuariosUrl}/login`,
      payload,
      { headers }
    ).pipe(
      tap(res => {
        if (res.codigoRespuesta === '1' && res.objeto) {
          const idPersona = res.objeto.usuario.idPersona?.idPersona;
          if (idPersona) {
            localStorage.setItem('token', res.objeto.token);
            localStorage.setItem('idPersona', idPersona.toString());
            localStorage.setItem('persona', JSON.stringify(res.objeto.usuario.idPersona));
          }
        }
      })
    );
  }

  register(registerData: RegisterDto): Observable<any> {
    return this.http.post<any>(`${this.apiUsuariosUrl}/register`, registerData);
  }

  saveLogin(loginData: User): Observable<any> {
    return this.http.post<any>(this.apiUsuariosUrl, loginData);
  }


  getPersonaById(idPersona: number): Observable<ApiResponse<PersonaDto>> {
    return this.http.get<ApiResponse<PersonaDto>>(`${this.apiPersonaUrl}/persona/${idPersona}`);
  }
}