import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno, TurnoDto } from '../models/turno.model';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  private baseUrl = '/turnos-api/api/turnos';

  constructor(private http: HttpClient) { }

  getTurnosByPaciente(idPaciente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/paciente/${idPaciente}`);
  }

  getTurnosByMedico(idMedico: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/medico/${idMedico}`);
  }

  getAllTurnos(): Observable<TurnoDto[]> {
    return this.http.get<TurnoDto[]>(this.baseUrl);
  }


  getTurnosByMedicoAndFecha(idMedico: number, fecha: string): Observable<any[]> {
    const params = new HttpParams()
      .set('idMedico', idMedico.toString())
      .set('fecha', fecha);
    return this.http.get<any[]>(`${this.baseUrl}/medico`, { params });
  }

  createTurno(turno: any): Observable<any> {
    return this.http.post<Turno>(this.baseUrl, turno);
  }

  updateTurno(id: number, turno: any): Observable<any> {
    return this.http.put<Turno>(`${this.baseUrl}/${id}`, turno);
  }

  deleteTurno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
