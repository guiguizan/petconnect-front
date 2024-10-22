import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroPetsComponent } from './pages/cadastro-pets/cadastro-pets.component';
import { CpfFormatDirective } from './directives/cpf-format.directive';
import { PerfilClienteComponent } from './pages/perfil-cliente/perfil-cliente.component';
import { PerfilPetsComponent } from './pages/perfil-pets/perfil-pets.component';
import { PainelComponent } from './pages/painel/painel.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'cadastro-pet', component: CadastroPetsComponent},
  {path: 'perfil-cliente', component: PerfilClienteComponent},
  {path: 'pets', component: PerfilPetsComponent},
  {path: 'painel', component: PainelComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
