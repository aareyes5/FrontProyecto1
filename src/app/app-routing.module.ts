import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PacienteDashboardComponent } from './paciente/paciente-dashboard/paciente-dashboard.component';
import { PresentacionComponent } from './presentacion/presentacion.component';
import { MedicosComponent } from './paciente/medicos/medicos.component';
import { CitasComponent } from './paciente/citas/citas.component';
import { MedicoDashboardComponent } from './medico/medico-dashboard/medico-dashboard.component';
import { EspecialidadComponent } from './paciente/especialidad/especialidad.component';
import { AgendaComponent } from './medico/agenda/agenda.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'paciente/dashboard', component: PacienteDashboardComponent },
  { path: 'medico/dashboard', component: MedicoDashboardComponent },
  { path: 'presentacion', component: PresentacionComponent },
  {
    path: 'paciente',
    component: PacienteDashboardComponent,
    children: [
      { path: '', redirectTo: 'citas', pathMatch: 'full' },
      { path: 'medicos', component: MedicosComponent },
      { path: 'citas', component: CitasComponent },
      { path: 'especialidades', component: EspecialidadComponent }
    ]
  },
  {
    path: 'medico',
    component: MedicoDashboardComponent,
    children: [
      { path: '', redirectTo: 'agenda', pathMatch: 'full' },
      { path: 'agenda', component: AgendaComponent }
    ]

  },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
