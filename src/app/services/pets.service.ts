import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PetService {

  private baseUrl = 'http://localhost:8888/api/v1/pets'; 

  constructor(private http: HttpClient) { }

  registerPet(petData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, petData);
  }

  updatePet(petId: number, petData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${petId}`, petData);
  }

  getPetById(petId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/${petId}`);
  }

  deletePet(petId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${petId}`);
  }

  listPets(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getAllPets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
}
