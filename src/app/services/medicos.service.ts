import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../models/medico.model';
import { Turno } from '../models/turno.model'; // Importa el modelo Turno o TurnoDto según tengas
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {
  private apiUrlMedicos = environment.apiUrls.medicos;

  constructor(private http: HttpClient) {}

  getMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.apiUrlMedicos);
  }

getTurnosByMedico(idMedico: number): Observable<Turno[]> {
  return this.http.get<Turno[]>(`${this.apiUrlMedicos}/${idMedico}`);
}

getNombreMedicoByIdPersona(idPersona: number): Observable<string> {
  return this.http.get(`${this.apiUrlMedicos}/nombres`, {
    params: { id_persona: idPersona.toString() },
    responseType: 'text' // ⚠️ Importante: porque el backend devuelve un String, no JSON
  });
}
}