import { Component, OnInit } from '@angular/core';
import { MedicosService } from '../../services/medicos.service';
import { UserService } from '../../services/user.service';
import { Medico } from '../../models/medico.model';
import { PersonaDto } from '../../models/persona.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  standalone: false,
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];
  personas: PersonaDto[] = [];
  error = '';

  constructor(
    private medicosService: MedicosService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Primero obtengo personas
    this.userService.getPersonas().subscribe({
      next: (personas) => {
        this.personas = personas;

        // Luego obtengo medicos
        this.medicosService.getMedicos().subscribe({
          next: (medicos) => {
            // Mapeo cada medico para poner el nombre desde personas
            this.medicos = medicos.map(medico => {
              const persona = this.personas.find(p => p.idPersona === medico.idPersona);
              return {
                ...medico,
                nombre: persona ? persona.nombre : 'Nombre no disponible'
              };
            });
          },
          error: () => this.error = 'Error cargando médicos.'
        });
      },
      error: () => this.error = 'Error cargando personas.'
    });
  }
}
