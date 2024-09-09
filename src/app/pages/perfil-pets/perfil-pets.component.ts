import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogErrorComponent } from 'src/app/components/dialog-error/dialog-error.component';
import { ConfirmDialog } from 'src/app/components/dialog/dialog.component';
import { PetService } from 'src/app/services/pets.service';
import { isHttpFailureResponse } from 'src/app/utils/error.validator';

@Component({
  selector: 'app-perfil-pet',
  templateUrl: './perfil-pets.component.html',
  styleUrls: ['./perfil-pets.component.scss']
})
export class PerfilPetsComponent implements OnInit {
  petDataForm!: FormGroup;
  pets: any[] = [];
  selectedPetIndex: number = 0;
  userId: any;

  constructor(private formBuilder: FormBuilder, private petService: PetService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('token');
    if (storedUserId) {
      this.userId = storedUserId;
      // Certifique-se de criar o formulário antes de carregar os dados
      this.createPetDataForm();
      this.loadUserDataAndPets(1);
    } else {
      console.log('Nenhum userId encontrado no sessionStorage.');
    }
  }
  

  createPetDataForm() {
    this.petDataForm = this.formBuilder.group({
      name: ['', Validators.required],
      breed: ['', Validators.required],
      color: ['', Validators.required],
      petType: ['', Validators.required],
      birthDate: ['', Validators.required],
    });
  }

  loadUserDataAndPets(userId: number): void {
    this.petService.getAllPets().subscribe(
      (data) => {
        // Mapeia os tipos de animal para o formulário
        this.pets = data.map(pet => {
          let mappedType;
          switch (pet.petType.toLowerCase()) {
            case 'dog':
            case 'cachorro':
              mappedType = 'DOG';
              break;
            case 'cat':
            case 'gato':
              mappedType = 'CAT';
              break;
            default:
              mappedType = 'OTHER';
          }
          return {
            ...pet,
            petType: mappedType
          };
        });

        if (this.pets.length > 0) {
          this.selectedPetIndex = 0;
          this.populatePetDataForm(this.pets[this.selectedPetIndex]);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  populatePetDataForm(pet: any): void {
    this.petDataForm.patchValue({
      name: pet.name,
      breed: pet.breed,
      color: pet.color,
      petType: pet.petType, // Preenche o tipo de animal corretamente
      birthDate: pet.birthDate,
    });
  }

  onSelectPet(index: number): void {
    this.selectedPetIndex = index;
    this.populatePetDataForm(this.pets[this.selectedPetIndex]);
  }

  updatePet(): void {
    if (this.petDataForm.valid) {
      this.petService.updatePet(this.pets[this.selectedPetIndex].idPet, this.petDataForm.getRawValue()).subscribe({
        next: (response: any) => {
          console.log('Pet atualizado com sucesso!', response);
          const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '250px',
            data: { message: 'Pet atualizado com sucesso!' }
          });
          dialogRef.afterClosed().subscribe(() => {
            console.log('sucess');
          });
        },
        error: (error: any) => {
          console.error('Erro ao atualizar pet', error);
          let requestErrorMessage = error.message;
          if (isHttpFailureResponse(error)) {
            requestErrorMessage = "Serviço fora do ar. Nossa equipe está trabalhando para voltar o quanto antes.";
          }
          const dialogRef = this.dialog.open(DialogErrorComponent, {
            width: '250px',
            data: { message: requestErrorMessage }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              // this.router.navigate(['/login']);
            }
          });
        }
      });
    } else {
      console.log('Formulário inválido. Verifique os campos.');
    }
  }

  openDeleteConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '250px',
      data: { message: "Você tem certeza que deseja excluir este pet?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePet();
      }
    });
  }

  deletePet(): void {
    this.petService.deletePet(this.pets[this.selectedPetIndex].idPet).subscribe({
      next: () => {
        console.log('Pet excluído com sucesso.');
        this.pets.splice(this.selectedPetIndex, 1);
        if (this.pets.length > 0) {
          this.onSelectPet(0);
        } else {
          this.petDataForm.reset();
        }
      },
      error: (error: any) => {
        console.error('Erro ao excluir o pet', error);
        let requestErrorMessage = error.message;
        if (isHttpFailureResponse(error)) {
          requestErrorMessage = "Serviço fora do ar. Nossa equipe está trabalhando para voltar o quanto antes.";
        }
        const dialogRef = this.dialog.open(DialogErrorComponent, {
          width: '250px',
          data: { message: requestErrorMessage }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  toggleEdit(field: string): void {
    if (this.petDataForm.get(field)?.disabled) {
      this.petDataForm.get(field)?.enable();
    } else {
      this.petDataForm.get(field)?.disable();
    }
  }

  redirect(route: string): void {
    this.router.navigate([route]);
  }
}
