import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PersonaDto } from '../../models/persona.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente-dashboard',
  templateUrl: './paciente-dashboard.component.html',
  standalone: false,
  styleUrls: ['./paciente-dashboard.component.css']
})
export class PacienteDashboardComponent implements OnInit {
  persona?: PersonaDto;
  mensaje = '';

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.persona = this.userService.getPersona();
    if (!this.persona) {
      // Redirigir si no hay datos (ej. acceso directo sin login)
      this.router.navigate(['/login']);
    }
  }

  cerrarSesion() {
    this.userService.logout(); 
    this.router.navigate(['/login']);
  }
}
