import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogErrorComponent } from 'src/app/components/dialog-error/dialog-error.component';
import { AppointmentService } from 'src/app/services/appointment.service';
import { isHttpFailureResponse } from 'src/app/utils/error.validator';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent implements OnInit {
  activeItem: number = 0;
  appointments: any[] = [];
  selectedAppointmentId: number | null = null;
  permissaoAdmin: any;
  filteredAppointments: any;
  isAdmin: boolean = false;
  isDarkTheme = false;
  veterinarianAppointments: any;

  constructor(private appointmentService: AppointmentService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    const permissao = localStorage.getItem('permission');
    this.permissaoAdmin = permissao === 'ADMIN';
    if (this.permissaoAdmin) {
      this.isAdmin = true;
      this.loadAdminAppointments();
    } else {
      this.isAdmin = false;
      this.loadAppointments();
    }
  }

  redirectProdutos(){
    this.router.navigate(['/produtos']);
  }

  loadAdminAppointments() {
    this.appointmentService.getAppointmentsAdmin().subscribe(
      (data: any) => {
        console.log(data);
        this.appointments = data.content;
        this.filterAppointments();
      },
      (error: any) => {
        console.error('Erro ao carregar agendamentos', error);

        let requestErrorMessage = error.message;
        if (isHttpFailureResponse(error)) {
          requestErrorMessage = 'Serviço fora do ar. Nossa equipe está trabalhando para voltar o quanto antes.';
        }
        const dialogRef = this.dialog.open(DialogErrorComponent, {
          width: '250px',
          data: { message: requestErrorMessage }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // this.router.navigate(['/login']);
          }
        });
      }
    );
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const theme = this.isDarkTheme ? 'dark-theme' : '';
    document.body.className = theme;
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(
      (data: any[]) => {
        console.log(data);
        this.appointments = data;
        this.filterAppointments();
      },
      (error: any) => {
        console.error('Erro ao carregar agendamentos', error);

        let requestErrorMessage = error.message;
        if (isHttpFailureResponse(error)) {
          requestErrorMessage = 'Serviço fora do ar. Nossa equipe está trabalhando para voltar o quanto antes.';
        }
        const dialogRef = this.dialog.open(DialogErrorComponent, {
          width: '250px',
          data: { message: requestErrorMessage }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // this.router.navigate(['/login']);
          }
        });
      }
    );
  }

  filterAppointments(): void {
    const allowedServices = ['BATH', 'BATH_AND_GROOMING', 'GROOMING'];
    this.filteredAppointments = this.appointments.filter(appointment =>
      allowedServices.includes(appointment.serviceType)
    );
    console.log(this.filteredAppointments);
  }

  filterVeterinarianAppointments(): void {
    const veterinarianAppointments =  this.appointments.filter(appointment => 
      appointment.serviceType === 'VETERINARIAN'
    );
    this.veterinarianAppointments = veterinarianAppointments;

  }

  logOut() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('permission');
    this.router.navigate(['/login']);
  }

  setActive(index: number) {
    const permissao = localStorage.getItem('permission');
    this.permissaoAdmin = permissao === 'ADMIN';
    if (this.permissaoAdmin) {
      this.isAdmin = true;
      this.loadAdminAppointments();
    } else {
      this.isAdmin = false;
      this.loadAppointments();
    }

    this.activeItem = index;
  }

  onEditAppointment(appointmentId: number) {
    console.log(appointmentId);
    this.selectedAppointmentId = appointmentId;
    this.setActive(2);
  }

  redirect(route: string) {
    this.router.navigate([route]);
  }
}
