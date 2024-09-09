import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/appointament';
  private apiUrlUser = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/appointament/user';


  constructor(private http: HttpClient) {}

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlUser}`);
  }

  getAppointmentById(appointmentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/{id}?idAppointament=${appointmentId}`);
  }

  getAppointmentsByPet(petId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pet/${petId}`);
  }

  scheduleAppointment(appointmentRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, appointmentRequest);
  }

  updateAppointment(appointmentId: number, appointmentRequest: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${appointmentId}`, appointmentRequest);
  }

  cancelAppointment(appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${appointmentId}`);
  }
}
