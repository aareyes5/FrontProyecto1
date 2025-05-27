import { Component, OnInit } from '@angular/core';
import { EspecialidadesService } from '../../services/especialidades.service';
import { Especialidad } from '../../models/especialidad.model';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  standalone: false,
  styleUrls: ['./especialidad.component.css'],
})
export class EspecialidadComponent implements OnInit {
  especialidades: Especialidad[] = [];
  mensaje = '';

  constructor(private especialidadesService: EspecialidadesService) {}

  ngOnInit(): void {
    this.especialidadesService.getAllEspecialidades().subscribe({
      next: (data) => {
        this.especialidades = data.filter((e) => e.estado === true);
      },
      error: () => {
        this.mensaje = 'Error al cargar especialidades.';
      },
    });
  }
}
