import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogErrorComponent } from 'src/app/components/dialog-error/dialog-error.component';
import { CadastroPetsService } from 'src/app/services/cadastro-pets.service';
import { PetService } from 'src/app/services/pets.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { isHttpFailureResponse } from 'src/app/utils/error.validator';

@Component({
  selector: 'app-cadastro-pets',
  templateUrl: './cadastro-pets.component.html',
  styleUrls: ['./cadastro-pets.component.scss']
})
export class CadastroPetsComponent implements OnInit {

  cadastroPetsForm: FormGroup;
  token: any;

  constructor(private petService: PetService, private router: Router,  private dialog: MatDialog) {
    this.cadastroPetsForm = new FormGroup({
      name: new FormControl(''),
      color: new FormControl('',),
      breed: new FormControl(''),
      petType: new FormControl(''),
      birthDate: new FormControl(''),
    });
  }


  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token){
      this.token = token
    }
  }
  

  cadastrar() {
    if (this.cadastroPetsForm.valid) {
      const formValues = { ...this.cadastroPetsForm.value };
 
      
      this.petService.registerPet(formValues).subscribe({
        next: (response) => {
          console.log('Pet cadastrado com sucesso', response);
          this.redirect('pets');
        },
        error: (error) => {
          console.error('Erro ao cadastrar pet', error);
          
          let requestErrorMessage = error.message;
          if (isHttpFailureResponse(error)) {
            requestErrorMessage = "Serviço fora do ar. Nossa equipe está trabalhando para voltar o quanto antes.";
          }
  
          const dialogRef = this.dialog.open(DialogErrorComponent, {
            width: '250px',
            data: { message: requestErrorMessage }
          });
          dialogRef.afterClosed().subscribe(() => {
            // Ações pós-diálogo, se necessário
          });
        }
      });
    }
  }
  
  redirect(route : string){
    this.router.navigate([route]);
  }

  

}
