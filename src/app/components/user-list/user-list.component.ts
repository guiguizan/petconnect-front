// src/app/components/user-list/user-list.component.ts

import { Component, OnInit } from '@angular/core';
import { AdministratorService } from 'src/app/services/administrator.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  roles: any[] = [];
  selectedRole: string = 'ALL';
  pageable = { page: 0, size: 10 }; 

  constructor(private adminService: AdministratorService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers(this.selectedRole);
  }

  loadUsers(ROLE: string): void {
    this.adminService.listUsers(ROLE, this.pageable.page, this.pageable.size).subscribe(
      (response: any) => {
        this.users = response.content;
      },
      (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    );
  }

  loadRoles(): void {
    this.usuarioService.getAllRoles().subscribe(
      (response: any) => {
        this.roles = response;
      },
      (error) => {
        console.error('Erro ao carregar papéis:', error);
      }
    );
  }

  onRoleChange(event: any): void {
    this.selectedRole = event.target.value;
    this.loadUsers(this.selectedRole);
    console.log('Papel selecionado:', this.selectedRole);
  }

  onRoleSelectChange(userId: number, selectedRoleId: number): void {
    console.log(`Usuário ID: ${userId}, Role selecionada: ${selectedRoleId}`);
    const user = this.users.find(u => u.idUser === userId);
    if (user) {
      const email = user.email;
      this.adminService.updateUserRole(email, selectedRoleId).subscribe(
        (response) => {
          console.log('Role updated successfully', response);
          // Optionally, refresh the user list
          this.loadUsers(this.selectedRole);
        },
        (error) => {
          console.error('Erro ao atualizar o papel do usuário:', error);
        }
      );
    }
  }

  editUser(userId: number): void {
    console.log('Editar usuário com ID:', userId);
  }
}
