import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterDto } from '../../models/register.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: RegisterDto = {
    usuario: '',
    mail: '',
    contrasena: '',
    estado: true,
    nombre: '',
    edad: 0,
    cedula: '',
    rol: 'paciente'
  };

  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.error = '';
    this.success = '';

    this.authService.register(this.user).subscribe({
      next: (res) => {
        if (res.codigo === '1' && res.objeto?.idPersona) {
          const idPersonaNum = res.objeto.idPersona.idPersona || res.objeto.idPersona;
          // según tu API, a veces puede venir solo el número

          const loginPayload: User = {
            usuario: this.user.usuario,
            mail: this.user.mail,
            contrasena: this.user.contrasena,
            estado: true,
            rol: this.user.rol, // rol pacinete o medico
            idPersona: { idPersona: idPersonaNum }
          };


          this.authService.saveLogin(loginPayload).subscribe({
            next: (resLogin) => {
              if (resLogin.codigo === '1') {
                this.success = '✅ Usuario registrado correctamente. Redirigiendo...';
                setTimeout(() => this.router.navigate(['/login']), 1500);
              } else {
                this.error = resLogin.mensaje || '❌ Error al guardar login.';
              }
            },
            error: (errLogin) => {
              console.error('Error login:', errLogin);
              this.error = errLogin?.error?.mensajeRespuesta || '❌ Error al guardar login.';
            }
          });
        } else {
          this.error = res.mensaje || '❌ Error al registrar persona.';
        }
      },
      error: (err) => {
        const msg = err?.error?.mensajeRespuesta || '❌ Error al registrar persona.';
        this.error = msg.includes('cedula') ? '❌ La cédula ya existe.' : msg;
        console.error('Error persona:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
