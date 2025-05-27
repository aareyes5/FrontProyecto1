// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { PersonaDto } from '../models/persona.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../models/login-response.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private personaActual?: PersonaDto;
  private apiUrl = '/auth-api/api/auth/persona'; 

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

  getPersonas() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<PersonaDto[]>>(this.apiUrl, { headers }).pipe(
      map(response => response.objeto) // extraemos solo la data (lista de personas)
    );
  }
}
