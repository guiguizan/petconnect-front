import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  @Input() appointments: any[] = [];
  @Output() editAppointmentEvent = new EventEmitter<number>();
  currentWeekStart: Date = this.getStartOfWeek(new Date());
  permissaoAdmin: boolean = false;


  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.currentWeekStart = this.getStartOfWeek(new Date());

    const permissao = localStorage.getItem('permission');
    this.permissaoAdmin = permissao === 'ADMIN';

  }

  ngOnChanges() {
    console.log(this.appointments);
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajusta quando o dia é domingo
    return new Date(date.setDate(diff));
  }

  getDaysOfWeek(): Date[] {
    const days = [];
    const startOfWeek = new Date(this.currentWeekStart);
    for (let i = 0; i < 7; i++) {
      days.push(new Date(startOfWeek.setDate(startOfWeek.getDate() + (i === 0 ? 0 : 1))));
    }
    return days;
  }

  getAppointmentsForDay(day: Date): any[] {
    const dayString = this.datePipe.transform(day, 'yyyy-MM-dd');
    return this.appointments.filter(appointment => {
      return appointment.appointmentDate === dayString;
    });
  }
  

  previousWeek() {
    this.currentWeekStart = new Date(this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7));
  }

  nextWeek() {
    this.currentWeekStart = new Date(this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7));
  }

  editAppointment(appointmentId: number) {
    this.editAppointmentEvent.emit(appointmentId);
  }

  getDisplayServiceType(serviceType: string): string {
    switch (serviceType) {
      case 'BATH':
        return 'Banho';
      case 'BATH_AND_GROOMING':
        return 'Banho e Tosa';
      case 'GROOMING':
        return 'Tosa';
      case 'VETERINARIAN':
        return 'Veterinário';
      default:
        return serviceType;
    }
  }
}
