import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Especialidad } from '../models/especialidad.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EspecialidadesService {
    private apiUrlEspecialidades = environment.apiUrls.especialidades;

    constructor(private http: HttpClient) { }

getEspecialidades(): Observable<Especialidad[]> {
  return this.http.get<Especialidad[]>(`${this.apiUrlEspecialidades}`);
}

getEspecialidadById(id: number): Observable<Especialidad> {
  return this.http.get<Especialidad>(`${this.apiUrlEspecialidades}/${id}`);
}

    getAllEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrlEspecialidades}`);
  }

}
