import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PetResponseDto {
  idPet: number;
  name: string;
  color: string;
  breed: string;
  petType: string;
  birthDate: string;
  age: number;
  userId: number;
  createdAt: string;
  updateAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class PetService {

  private petUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/pet';
  private apiUrl = 'https://pet-connect-postgree-27f454547a44.herokuapp.com/api/v1/pet/my-pets';
  
  constructor(private http: HttpClient) { }

  // Get pets by idPet
  getPetById(idPet: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get(`${this.petUrl}/${idPet}`, { headers });
  }

  // Update pet by idPet
  updatePet(idPet: number, petData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put(`${this.petUrl}/${idPet}`, petData, { headers });
  }
  

  // Delete pet by idPet
  deletePet(idPet: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete(`${this.petUrl}/{id}?idPet=${idPet}`, { headers });
  }

  // Insert new pet
  registerPet(petData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(this.petUrl, petData);
  }

  // Get all pets with pagination
  getAllPets(): Observable<PetResponseDto[]> {
    return this.http.get<PetResponseDto[]>(this.apiUrl);
  }
}
