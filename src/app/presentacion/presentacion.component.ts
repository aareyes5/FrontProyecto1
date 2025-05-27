import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { PersonaDto } from '../models/persona.model';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  standalone: false,
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent implements OnInit {
  persona!: PersonaDto;
  error = '';
  opcionSeleccionada = '';
  accesoDenegado = false;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    const personaStr = localStorage.getItem('persona');
    if (personaStr) {
      this.persona = JSON.parse(personaStr);
    } else {
      this.error = 'No se encontró información de la persona';
    }
  }

  ingresar() {
    if (this.opcionSeleccionada === this.persona.rol.toLowerCase()) {
      this.userService.setPersona(this.persona);
      if (this.opcionSeleccionada === 'paciente') {
        this.router.navigate(['/paciente/dashboard']);
      } else if (this.opcionSeleccionada === 'medico') {
        this.router.navigate(['/medico/dashboard']);
      }
    } else {
      this.accesoDenegado = true;
    }
  }
}
