import { Component, OnInit } from '@angular/core';
import { TurnosService } from '../../services/turnos.service';
import { UserService } from '../../services/user.service';
import { PersonaDto } from '../../models/persona.model';

@Component({
  selector: 'app-cita-medico',
  templateUrl: './agenda.component.html',
  standalone: false,
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  turnos: any[] = [];
  mensaje = '';
  persona?: PersonaDto;

  constructor(
    private turnosService: TurnosService,
    private userService: UserService
  ) {}

ngOnInit(): void {
  this.persona = this.userService.getPersona();

  this.turnosService.getAllTurnos().subscribe({
    next: (data) => {
      this.turnos = data;
    },
    error: () => {
      this.mensaje = 'Error al cargar los turnos.';
    }
  });
}

}