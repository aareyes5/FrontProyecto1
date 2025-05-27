// src/app/models/user.model.ts
import { PersonaDto } from './persona.model';

export interface User {
  usuario: string;
  mail: string;
  contrasena: string;
  estado: boolean;
   idPersona: { idPersona: number }; // permite solo idPersona u otros campos opcionales
  rol: string;
}

