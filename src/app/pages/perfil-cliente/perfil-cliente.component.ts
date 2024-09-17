import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogErrorComponent } from 'src/app/components/dialog-error/dialog-error.component';
import { ConfirmDialog } from 'src/app/components/dialog/dialog.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { isHttpFailureResponse } from 'src/app/utils/error.validator';


@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.scss']
})
export class PerfilClienteComponent implements OnInit {
  userName: string = 'teste'
  userId!: any;
  userDataForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private router: Router) { }
  ngOnInit(): void {
    this.createUserDataForm();
    const storedUserId = localStorage.getItem('token');
    if (storedUserId) {
      this.userId = storedUserId;

      this.loadUserData(this.userId);
    } else {
      console.log('Nenhum userId encontrado no sessionStorage.');
    }
    // this.loadUserData(this.userId);
  }

  createUserDataForm(){
    this.userDataForm = this.formBuilder.group({
      email: [{ value: '', disabled: true }, Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      cpf: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: [{ value: '', disabled: true }, Validators.required],
    });
  }

  loadUserData(userId: any): void {
    this.usuarioService.getUser().subscribe({
      next: (userData) => {
        console.log(userData.contacts[0].contactValue)
        this.userName = userData.username;
        this.userDataForm = this.formBuilder.group({
          email: [{ value: userData.email, disabled: true }, Validators.required],
          name: [{ value: userData.nmUser, disabled: true }, Validators.required],
          cpf: [{ value: userData.cpf, disabled: true }, Validators.required],
          phoneNumber: [{ value: userData.contacts[0].contactValue, disabled: true }, Validators.required],
        });
      },
      error: (error) => {
        console.error('Erro ao carregar os dados do usuário', error);
        let requestErrorMessage = error.message;
        if (isHttpFailureResponse(error)) {
          requestErrorMessage = "Serviço fora do ar. Nossa equipe está trabalhando para voltar o quanto antes."
        }
        const dialogRef = this.dialog.open(DialogErrorComponent, {
          width: '250px',
          data: { message: requestErrorMessage }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  updateUser(): void {
    if (this.userDataForm.valid) {
      const updateData = {
        name: this.userDataForm.get('name')?.value,
        contacts: [
          {
            type: 'phone',
            contactValue: this.userDataForm.get('phoneNumber')?.value,
          },
        ],
      };
  
      this.usuarioService.updateUser(updateData).subscribe({
        next: (response) => {
          console.log('Usuário atualizado com sucesso', response);
          const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '250px',
            data: { message: 'Usuário atualizado com sucesso!' },
          });
          dialogRef.afterClosed().subscribe(() => {
            this.clearLocalStorage();
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          console.error('Erro ao atualizar usuário', error);
  
          let requestErrorMessage = error.message;
          if (isHttpFailureResponse(error)) {
            requestErrorMessage =
              'Serviço fora do ar. Nossa equipe está trabalhando para voltar o quanto antes.';
          }
          const dialogRef = this.dialog.open(DialogErrorComponent, {
            width: '250px',
            data: { message: requestErrorMessage },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              // Ações após o diálogo ser fechado, se necessário
            }
          });
        },
      });
    } else {
      console.log('Formulário inválido. Verifique os campos.');
    }
  }

  toggleEdit(field: string): void {
    if (this.userDataForm.get(field)?.disabled) {
      this.userDataForm.get(field)?.enable();
    } else {
      this.userDataForm.get(field)?.disable();
    }
  }

  openDeleteConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '250px',
      data: { message: "Você tem certeza que deseja excluir esta conta?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser();
      }
    });
  }

  deleteUser(): void {
    this.usuarioService.deleteUser().subscribe({
      next: () => {
        console.log('Usuário excluído com sucesso.');
        const dialogRef = this.dialog.open(ConfirmDialog, {
          width: '250px',
          data: { message: 'Usuário deletado com sucesso!' }
        });
        dialogRef.afterClosed().subscribe(() => {
          this.clearLocalStorage();
          this.router.navigate(['/login']);
        });
  
       
      },
      error: (error) => {
        console.error('Erro ao excluir o usuário', error);


        let requestErrorMessage = error.message;
        if (isHttpFailureResponse(error)) {
          requestErrorMessage = "Serviço fora do ar. Nossa equipe está trabalhando para voltar o quanto antes."
        }
        const dialogRef = this.dialog.open(DialogErrorComponent, {
          width: '250px',
          data: { message: requestErrorMessage }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  clearLocalStorage(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('permission');
  }

  redirect(route : string){
    this.router.navigate([route]);
  }

}
