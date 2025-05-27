import { Component, OnInit } from '@angular/core';
import { TurnosService } from '../../services/turnos.service';
import { MedicosService } from '../../services/medicos.service';
import { EspecialidadesService } from '../../services/especialidades.service';
import { Turno } from '../../models/turno.model';
import { Medico } from '../../models/medico.model';
import { Especialidad } from '../../models/especialidad.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  standalone: false,
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  turnos: Turno[] = [];
  medicos: Medico[] = [];
  especialidades: Especialidad[] = [];
  pacienteId?: number;
  error = '';
  personasMap: Map<number, string> = new Map();
  medicoNombresMap: Map<number, string> = new Map();
  especialidadNombresCache: Map<number, string> = new Map();

  datosListos = false;

  formTurno: {
    fecha?: string;
    hora?: string;
    id_medico?: number;
    id_especialidad?: number;
  } = {};

  formularioVisible = false;
  turnoEditar?: Turno;

  constructor(
    private turnosService: TurnosService,
    private medicosService: MedicosService,
    private especialidadesService: EspecialidadesService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    const persona = this.userService.getPersona();
    if (persona) {
      this.pacienteId = persona.idPersona;

      try {
        const medicos = await firstValueFrom(this.medicosService.getMedicos());
        this.medicos = medicos;
        await this.cargarNombresPersonas(medicos);
        await this.cargarEspecialidades();
        await this.cargarTurnos();

        this.datosListos = true; // Todos los datos cargados
      } catch (error) {
        this.error = 'Error cargando datos.';
      }

    } else {
      this.error = 'No se encontró información de paciente.';
    }
  }
async cargarTurnos(): Promise<void> {
  if (!this.pacienteId) return;

  try {
    const turnos = await firstValueFrom(this.turnosService.getTurnosByPaciente(this.pacienteId));

    this.turnos = turnos.map(t => {
      const idMedico = t.idMedico?.idMedico ?? 0;
      const idEspecialidad = t.idEspecialidad?.idEspecialidad ?? 0;

      // Buscar nombre en los mapas
      const nombreMedico = this.medicoNombresMap.get(idMedico) ?? 'Desconocido';
      const nombreEspecialidad = this.especialidadNombresCache.get(idEspecialidad) ?? 'Desconocida';

      // intentar cargar especialidad en cache si no está
      if (!this.especialidadNombresCache.has(idEspecialidad) && idEspecialidad > 0) {
        this.especialidadesService.getEspecialidadById(idEspecialidad).subscribe({
          next: (esp) => this.especialidadNombresCache.set(idEspecialidad, esp.nombre),
          error: () => this.especialidadNombresCache.set(idEspecialidad, 'Desconocida'),
        });
      }

      return {
        id_turno: t.idTurno,
        fecha: t.fecha,
        hora: t.hora,
        id_medico: idMedico,
        id_especialidad: idEspecialidad,
        id_paciente: t.idPaciente,
        nombreMedico,
        nombreEspecialidad
      };
    });

  } catch {
    this.error = 'Error cargando turnos.';
  }
}

  async cargarNombresPersonas(medicos: Medico[]): Promise<void> {
    const promesas = medicos.map(async (medico) => {
      try {
        const res = await firstValueFrom(this.authService.getPersonaById(medico.idPersona));
        if (res?.codigoRespuesta === '1' && res.objeto) {
          this.medicoNombresMap.set(medico.idMedico, res.objeto.nombre); // clave
        } else {
          this.medicoNombresMap.set(medico.idMedico, 'Desconocido');
        }
      } catch {
        this.medicoNombresMap.set(medico.idMedico, 'Desconocido');
      }
    });

    await Promise.all(promesas);
    console.log('Mapa de nombres de médicos:', this.medicoNombresMap);
  }

  async cargarEspecialidades(): Promise<void> {
    try {
      const especialidades = await firstValueFrom(this.especialidadesService.getEspecialidades());
      this.especialidades = especialidades;
    } catch {
      this.error = 'Error cargando especialidades.';
    }
  }

  getMedicoNombre(idMedico: number): string {
    return this.medicoNombresMap.get(idMedico) ?? 'Cargando...';
  }

  getEspecialidadNombre(id: number): string {
    const nombre = this.especialidadNombresCache.get(id);
    if (nombre) {
      return nombre;
    } else {
      this.especialidadesService.getEspecialidadById(id).subscribe({
        next: (especialidad) => {
          this.especialidadNombresCache.set(id, especialidad.nombre);
        },
        error: () => {
          this.especialidadNombresCache.set(id, 'Desconocida');
        }
      });
      return 'Cargando...';
    }
  }

  mostrarFormularioEditar(turno: Turno) {
    this.formularioVisible = true;
    this.turnoEditar = turno;
    this.formTurno = { ...turno };
  }

  mostrarFormularioNuevo() {
    this.formularioVisible = true;
    this.turnoEditar = undefined;
    this.formTurno = {
      fecha: '',
      hora: '',
      id_medico: 0,
      id_especialidad: 0
    };
  }

  cancelarFormulario() {
    this.formularioVisible = false;
    this.turnoEditar = undefined;
  }

  guardarTurno(): void {
  this.error = '';

  if (!this.formTurno.fecha || !this.formTurno.hora || !this.formTurno.id_medico || !this.formTurno.id_especialidad) {
    this.error = 'Todos los campos son obligatorios';
    return;
  }

  // Formatear hora si hace falta y agregar segundos)
  const horaFormateada = this.formTurno.hora.length === 5 ? this.formTurno.hora + ':00' : this.formTurno.hora;

  // los IDs sean números válidos y no 0
  const idMedicoNum = Number(this.formTurno.id_medico);
  const idEspecialidadNum = Number(this.formTurno.id_especialidad);

  if (idMedicoNum <= 0 || idEspecialidadNum <= 0) {
    this.error = 'Debe seleccionar médico y especialidad válidos';
    return;
  }

  //estructura de envio post a backend
  const turnoDto = {
    idTurno: this.turnoEditar ? this.turnoEditar.id_turno : 0,
    idPaciente: this.pacienteId!,
    fecha: this.formTurno.fecha!,
    hora: horaFormateada,
    idMedico: { idMedico: idMedicoNum },
    idEspecialidad: { idEspecialidad: idEspecialidadNum }
  };

  if (this.turnoEditar) {
    this.turnosService.updateTurno(turnoDto.idTurno, turnoDto).subscribe({
      next: () => {
        this.cargarTurnos(); //cargar de nuevo datos
        this.formularioVisible = false;
      },
      error: (err) => {
        this.error = 'Error actualizando turno.';
        console.error(err);
      }
    });
  } else {
    this.turnosService.createTurno(turnoDto).subscribe({
      next: () => {
        this.cargarTurnos(); //crear de nuevo datos
        this.formularioVisible = false;
      },
      error: (err) => {
        this.error = 'Error creando turno.';
        console.error(err);
      }
    });
  }
}

  eliminarTurno(id: number) {
    if (confirm('¿Estás seguro de eliminar este turno?')) {
      this.turnosService.deleteTurno(id).subscribe({
        next: () => this.cargarTurnos(),
        error: () => this.error = 'Error eliminando turno.'
      });
    }
  }
}