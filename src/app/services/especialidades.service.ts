import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Especialidad } from '../models/especialidad.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EspecialidadesService {
    private apiUrl = '/turnos-api/api/turnos/especialidad'; // Cambia según tu API

    constructor(private http: HttpClient) { }

    getEspecialidades(): Observable<Especialidad[]> {
        return this.http.get<Especialidad[]>(this.apiUrl);
    }

    getAllEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}`);
  }

  getEspecialidadById(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.apiUrl}/${id}`);
  }
}
