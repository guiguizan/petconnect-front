// analytics.service.ts
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

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private baseUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/analytics';

  constructor(private http: HttpClient) {}

  getSummaryForAppointments(): Observable<AppointmentSummaryResponseDto> {
    return this.http.get<AppointmentSummaryResponseDto>(`${this.baseUrl}/summary-for-appointments`);
  }
}
