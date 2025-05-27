import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    usuario: '',
    contrasena: ''
  };

  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';

    const loginPayload = {
      usuario: this.user.usuario.trim(),
      contrasena: this.user.contrasena
    };

    this.authService.login(loginPayload).subscribe({
      next: (res) => {
        if (res.codigoRespuesta === '1' && res.objeto) {
          const loginResponse = res.objeto;
          const user: User = loginResponse.usuario;

          localStorage.setItem('token', loginResponse.token);

          // Guarda directamente toda la estructura del usuario con la persona incluida
          localStorage.setItem('persona', JSON.stringify(user.idPersona)); // PersonaDto
          localStorage.setItem('idPersona', user.idPersona.idPersona.toString());

          this.router.navigate(['/presentacion']);
        } else {
          this.error = res.mensajeRespuesta || 'Usuario o contraseña incorrectos';
        }
      },
      error: () => {
        this.error = 'Error en la conexión al servidor';
      }
    });
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}
