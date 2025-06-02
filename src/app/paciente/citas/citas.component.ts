import { Component, OnInit } from '@angular/core';
import { TurnosService } from '../../services/turnos.service';
import { MedicosService } from '../../services/medicos.service';
import { EspecialidadesService } from '../../services/especialidades.service';
import { Turno } from '../../models/turno.model';
import { Medico } from '../../models/medico.model';
import { Especialidad } from '../../models/especialidad.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
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
  ) {}

  async ngOnInit(): Promise<void> {
    const persona = this.userService.getPersona();
    if (!persona) {
      this.error = 'No se encontró información de paciente.';
      return;
    }

    this.pacienteId = persona.idPersona;

    try {
      const [medicos, especialidades] = await Promise.all([
        firstValueFrom(this.medicosService.getMedicos()),
        firstValueFrom(this.especialidadesService.getEspecialidades())
      ]);

      // Obtener nombre del médico desde idPersona
      for (const medico of medicos) {
        try {
          const persona = await firstValueFrom(this.userService.getPersonaById(medico.idPersona));
          medico.nombre = persona.nombre;
        } catch (e) {
          medico.nombre = 'Desconocido';
        }
      }

      this.medicos = medicos;
      this.especialidades = especialidades;

      await this.cargarTurnos();
      this.datosListos = true;
    } catch (error) {
      console.error(error);
      this.error = 'Error cargando datos.';
    }
  }

  async cargarTurnos(): Promise<void> {
    if (!this.pacienteId) return;

    try {
      const turnos = await firstValueFrom(this.turnosService.getTurnosByPaciente(this.pacienteId));
      const turnosProcesados: Turno[] = [];

      for (const t of turnos) {
        const idMedico = t.idMedico?.idMedico ?? 0;

        const medicoEncontrado = this.medicos.find(m => m.idMedico === idMedico);
        let nombreMedico = 'Desconocido';
        if (medicoEncontrado) {
          nombreMedico = medicoEncontrado.nombre ?? 'Desconocido'; // ✅ Ya no usamos medico.persona.nombre
        }

        const idEspecialidad = t.idEspecialidad?.idEspecialidad ?? 0;
        let nombreEspecialidad = this.especialidadNombresCache.get(idEspecialidad) ?? 'Desconocida';

        if (!this.especialidadNombresCache.has(idEspecialidad) && idEspecialidad > 0) {
          try {
            const esp = await firstValueFrom(this.especialidadesService.getEspecialidadById(idEspecialidad));
            this.especialidadNombresCache.set(idEspecialidad, esp.nombre);
            nombreEspecialidad = esp.nombre;
          } catch {
            nombreEspecialidad = 'Desconocida';
          }
        }

        turnosProcesados.push({
          id_turno: t.idTurno,
          fecha: t.fecha,
          hora: t.hora,
          id_medico: idMedico,
          id_especialidad: idEspecialidad,
          id_paciente: t.idPaciente,
          nombreMedico,
          nombreEspecialidad
        });
      }

      this.turnos = turnosProcesados;
    } catch (error) {
      console.error(error);
      this.error = 'Error cargando turnos.';
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

    const horaFormateada = this.formTurno.hora.length === 5 ? this.formTurno.hora + ':00' : this.formTurno.hora;
    const idMedicoNum = Number(this.formTurno.id_medico);
    const idEspecialidadNum = Number(this.formTurno.id_especialidad);

    if (idMedicoNum <= 0 || idEspecialidadNum <= 0) {
      this.error = 'Debe seleccionar médico y especialidad válidos';
      return;
    }

    const turnoDto = {
      idTurno: this.turnoEditar ? this.turnoEditar.id_turno : 0,
      idPaciente: this.pacienteId!,
      fecha: this.formTurno.fecha!,
      hora: horaFormateada,
      idMedico: { idMedico: idMedicoNum },
      idEspecialidad: { idEspecialidad: idEspecialidadNum }
    };

    const request = this.turnoEditar
      ? this.turnosService.updateTurno(turnoDto.idTurno, turnoDto)
      : this.turnosService.createTurno(turnoDto);

    request.subscribe({
      next: () => {
        this.cargarTurnos();
        this.formularioVisible = false;
      },
      error: (err) => {
        this.error = this.turnoEditar ? 'Error actualizando turno.' : 'Error creando turno.';
        console.error(err);
      }
    });
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
