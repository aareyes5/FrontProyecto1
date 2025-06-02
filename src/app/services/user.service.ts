// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { PersonaDto } from '../models/persona.model';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../models/login-response.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private personaActual?: PersonaDto;
  private apiUrl = environment.apiUrls.usuarios;
  private apiLogin = environment.apiUrls.login;

  constructor(private http: HttpClient) { }

  setPersona(persona: PersonaDto) {
    this.personaActual = persona;
  }

  getPersona(): PersonaDto | undefined {
    return this.personaActual;
  }

  logout() {
    this.personaActual = undefined;
  }

 getPersonas(): Observable<PersonaDto[]> {
  const token = localStorage.getItem('token');

  if (!token) {
    return throwError(() => new Error('Token no disponible. El usuario no está logueado.'));
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<ApiResponse<PersonaDto[]>>(`${this.apiLogin}/persona`, { headers })
    .pipe(map(response => response.objeto));
}

  getPersonaById(idPersona: number): Observable<PersonaDto> {
    return this.http.get<PersonaDto>(`${this.apiLogin}/persona/${idPersona}`);
  }

}
