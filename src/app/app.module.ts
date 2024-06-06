import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CadastroPetsComponent } from './pages/cadastro-pets/cadastro-pets.component';
import { CpfFormatDirective } from './directives/cpf-format.directive';
import { PerfilClienteComponent } from './pages/perfil-cliente/perfil-cliente.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialog } from './components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PerfilPetsComponent } from './pages/perfil-pets/perfil-pets.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { PainelComponent } from './pages/painel/painel.component';
import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';
import { NewAppointmentComponent } from './components/new-appointment/new-appointment.component';
import { DogComponent } from './components/dog/dog.component';
import { AuthInterceptor } from './interceptors/auth-interceptor.service';
import { UsuarioService } from './services/usuario.service';
import { CadastroPetsService } from './services/cadastro-pets.service';
import { PetService } from './services/pets.service';


registerLocaleData(localePt, 'pt-BR', localePtExtra); 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroPetsComponent,
    PerfilPetsComponent,
    CpfFormatDirective,
    PerfilClienteComponent,
    ConfirmDialog,
    SchedulerComponent,
    PainelComponent,
    NewAppointmentComponent,
    DogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule 
    
  ],
  providers: [
    UsuarioService,
    DatePipe,
    CadastroPetsService,
    PetService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
