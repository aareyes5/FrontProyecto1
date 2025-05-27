import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../models/medico.model';
import { Turno } from '../models/turno.model'; // Importa el modelo Turno o TurnoDto según tengas
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicosService {
  private apiUrlMedicos = '/turnos-api/api/turnos/medicos'; 

  constructor(private http: HttpClient) {}

  // Obtener todos los médicos
  getMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.apiUrlMedicos);
  }
  
  // Obtener turnos por médico
  getTurnosByMedico(idMedico: number): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrlMedicos}/${idMedico}`);
  }
}
