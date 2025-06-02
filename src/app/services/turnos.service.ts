import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno, TurnoDto } from '../models/turno.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  private apiUrl = environment.apiUrls.turnos;

  constructor(private http: HttpClient) { }

  getTurnosByPaciente(idPaciente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${idPaciente}`);
  }

  getTurnosByMedico(idMedico: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicos/${idMedico}`);
  }

  getAllTurnos(): Observable<TurnoDto[]> {
    return this.http.get<TurnoDto[]>(this.apiUrl);
  }


  getTurnosByMedicoAndFecha(idMedico: number, fecha: string): Observable<any[]> {
    const params = new HttpParams()
      .set('idMedico', idMedico.toString())
      .set('fecha', fecha);
    return this.http.get<any[]>(`${this.apiUrl}/medicos`, { params });
  }

  createTurno(turno: any): Observable<any> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }

  updateTurno(id: number, turno: any): Observable<any> {
    return this.http.put<Turno>(`${this.apiUrl}/${id}`, turno);
  }

  deleteTurno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTurnosByPacienteAndFecha(idPaciente: number, fecha: string): Observable<any[]> {
  const params = new HttpParams()
    .set('idPaciente', idPaciente.toString())
    .set('fecha', fecha);

  return this.http.get<any[]>(`${this.apiUrl}/paciente`, { params });
}

}