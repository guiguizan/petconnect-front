import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {
  private apiUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/administrator';

  constructor(private http: HttpClient) {}

  listUsers(roleName: string, page: number, size: number): Observable<any> {
    const url = `${this.apiUrl}/list-user/{roleName}?`;
    let params = new HttpParams();
    params = params.append('roleName', roleName); 
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());

    return this.http.get(url, { params });
  }
}