export interface Turno {
  id_turno: number;
  id_medico: number;
  id_especialidad: number;
  id_paciente: number;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm:ss
  nombreMedico?: string;
  nombreEspecialidad?: string;
}

export interface TurnoDto {
  idTurno: number;
  idPaciente: number;
  fecha: string;
  hora: string;
  idMedico: { idMedico: number };
  idEspecialidad: { idEspecialidad: number };
}


