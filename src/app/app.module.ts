import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthService } from './services/auth.service';
import { PacienteDashboardComponent } from './paciente/paciente-dashboard/paciente-dashboard.component';
import { CitasComponent } from './paciente/citas/citas.component';
import { MedicosComponent } from './paciente/medicos/medicos.component';
import { PresentacionComponent } from './presentacion/presentacion.component';
//seguridad JWT
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { MedicoDashboardComponent } from './medico/medico-dashboard/medico-dashboard.component';
import { EspecialidadComponent } from './paciente/especialidad/especialidad.component';
import { AgendaComponent } from './medico/agenda/agenda.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PacienteDashboardComponent,
    CitasComponent,
    MedicosComponent,
    PresentacionComponent,
    MedicoDashboardComponent,
    EspecialidadComponent,

    AgendaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
