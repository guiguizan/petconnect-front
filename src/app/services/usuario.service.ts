import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/user';
  private authUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/auth';
  private passwordUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/password';
  private roleUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/role-user';

  constructor(private http: HttpClient) { }

  registerUser(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.authUrl}/signup`, userData, { headers });
  }

  loginUser(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, userData).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  updateUser(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put(`${this.baseUrl}`, userData, { headers });
  }

  
  getUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get(`${this.baseUrl}`, { headers });
  }

  deleteUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete(`${this.baseUrl}`, { headers });
  }

  updatePassword(passwordData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put(`${this.baseUrl}/update-password`, passwordData, { headers });
  }

  resetPassword(emailData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.passwordUrl}/reset-password?email=` + emailData.email, { headers });
  }

  confirmResetPassword(token: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = { newPassword, token };
    const url = `${this.passwordUrl}/reset-password/confirm?token=` +  token + '&newPassword=' + newPassword;
    return this.http.post(url, body, { headers });
  }

  getAllRoles(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get(`${this.roleUrl}`, { headers });
  }
}
