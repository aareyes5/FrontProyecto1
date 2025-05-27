  import { Especialidad } from './especialidad.model';

  export interface Medico {
    idMedico: number;
    idPersona: number;
    idEspecialidad?: Especialidad;
    horarioInicio: string;
    horarioFin: string;
    nombre?: string;  
  }
