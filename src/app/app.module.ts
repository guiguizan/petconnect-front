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
import { DialogErrorComponent } from './components/dialog-error/dialog-error.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { PhoneMaskDirective } from './phone-mask.directive';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './sharedPages/navbar/navbar.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { ProdutoComponent } from './components/produto/produto.component';
import { DynamicDropdownsComponent } from './components/dynamic-dropdowns/dynamic-dropdowns.component';
import { ProdutoFormComponent } from './components/produto-form/produto-form.component';
import { AnalytcsComponent } from './components/analytcs/analytcs.component';
import { AppointmentMonthlySummaryComponent } from './components/appointment-monthly-summary/appointment-monthly-summary.component';




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
    DialogErrorComponent,
    ResetPasswordComponent,
    UserListComponent,
    PhoneMaskDirective,
    HomeComponent,
    NavbarComponent,
    CheckoutComponent,
    ProdutosComponent,
    CarrinhoComponent,
    ProdutoComponent,
    DynamicDropdownsComponent,
    ProdutoFormComponent,
    AnalytcsComponent,
    AppointmentMonthlySummaryComponent
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
