import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PersonaDto } from '../../models/persona.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medico-dashboard',
  templateUrl: './medico-dashboard.component.html',
  standalone: false,
  styleUrls: ['./medico-dashboard.component.css']
})
export class MedicoDashboardComponent implements OnInit {
  persona?: PersonaDto;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.persona = this.userService.getPersona();
    if (!this.persona) {
      this.router.navigate(['/login']);
    }
  }

  cerrarSesion(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
