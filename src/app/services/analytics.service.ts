
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppointmentSummaryDto {
  userId: number;
  userName: string;
  email: string;
  cpf: string;
  isActive: boolean;
  serviceType: string;
  totalAppointments: number;
}

export interface AppointmentSummaryResponseDto {
  appointmentSummaryDtos: AppointmentSummaryDto[];
  overallTotalAppointments: number;
}

export interface MonthlyAppointmentsPercentageDto {
  petType: string;
  totalAppointments: number;
  percentage: number;
}

export interface MonthlyAppointmentsGroupedDto {
  month: string;
  year: number;
  totalAppointments: number;
  appointments: MonthlyAppointmentsPercentageDto[];
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private baseUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/analytics';

  constructor(private http: HttpClient) {}

  // Método existente
  getSummaryForAppointments(): Observable<AppointmentSummaryResponseDto> {
    return this.http.get<AppointmentSummaryResponseDto>(`${this.baseUrl}/summary-for-appointments`);
  }

  // Novo método
  getAppointmentMonthlyPercentageSummary(): Observable<MonthlyAppointmentsGroupedDto[]> {
    return this.http.get<MonthlyAppointmentsGroupedDto[]>(`${this.baseUrl}/appointment-monthly-percentage-summary`);
  }
}