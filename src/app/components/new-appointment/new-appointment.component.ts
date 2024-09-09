import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PetService } from 'src/app/services/pets.service';
import { ConfirmDialog } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { isHttpFailureResponse } from 'src/app/utils/error.validator';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent implements OnInit, OnChanges {
  @Input() appointmentId: number | null = null;
  appointmentForm: FormGroup;
  pets: any[] = [];
  endTime: string = '';
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private petService: PetService,
    private dialog: MatDialog
  ) {
    this.appointmentForm = this.fb.group({
      petId: ['', Validators.required],
      serviceType: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required]
    });

    this.appointmentForm.valueChanges.subscribe(() => {
      this.calculateEndTime();
    });
  }

  ngOnInit(): void {
    this.loadPets();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointmentId'] && changes['appointmentId'].currentValue) {
      console.log(changes)
      console.log(changes['appointmentId'].currentValue)
      this.isEditMode = true;
      this.loadAppointment(changes['appointmentId'].currentValue);
      // this.loadAppointmentMock(changes['appointmentId'].currentValue);
    } else {
      this.isEditMode = false;
      this.appointmentForm.reset();
    }
  }

  loadPets(): void {
    // this.pets = [
    //   {
    //     "id": 3,
    //     "name": "nome teste",
    //     "age": 0,
    //     "color": "color teste",
    //     "breed": "breed teste",
    //     "animalType": "animal type teste",
    //     "birthdate": "2024-06-19",
    //     "createdAt": "2024-06-19T12:53:48.354Z",
    //     "updatedAt": "2024-06-19T12:53:48.354Z",
    //     "userId": 0
    //   }
    // ]
    
    this.petService.getAllPets().subscribe(
      (pets: any[]) => {
        console.log(pets)
        this.pets = pets;
      },
      (error: any) => {
        console.error('Error loading pets:', error);
      }
    );
  }

  loadAppointment(appointmentId: number): void {
    console.log(appointmentId)
    this.appointmentService.getAppointmentById(appointmentId).subscribe(
      (appointment: any) => {
        this.appointmentForm.patchValue(appointment);
        this.calculateEndTime();
      },
      (error: any) => {
        console.error('Error loading appointment:', error);
      }
    );
  }

  loadAppointmentMock(appointmentId: number): void {
    const mockAppointment = {
      petId: 1,
      serviceType: 'BATH_AND_GROOMING',
      petType: 'DOG',
      appointmentDate: '2024-06-05',
      appointmentTime: '10:00'
    };

    console.log('Loading appointment with ID:', appointmentId);
    this.appointmentForm.patchValue(mockAppointment);
    this.calculateEndTime();
  }

  calculateEndTime() {
    const serviceType = this.appointmentForm.get('serviceType')?.value;
    const appointmentTime = this.appointmentForm.get('appointmentTime')?.value;
    if (serviceType && appointmentTime) {
      const start = new Date(`1970-01-01T${appointmentTime}:00`);
      let end = new Date(start.getTime());

      switch (serviceType) {
        case 'BATH':
        case 'GROOMING':
          end = new Date(start.getTime() + 60 * 60 * 1000);
          break;
        case 'BATH_AND_GROOMING':
          end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
          break;
        case 'VETERINARY_CONSULTATION':
          end = new Date(start.getTime() + 30 * 60 * 1000);
          break;
      }

      this.endTime = end.toTimeString().slice(0, 5);
    }
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const newAppointment = {
        ...this.appointmentForm.value
      };
      console.log(newAppointment)

      if (this.isEditMode && this.appointmentId) {
        this.appointmentService.updateAppointment(this.appointmentId, newAppointment).subscribe(
          (response: any) => {
            console.log('Agendamento realizado com sucesso!', response);
            const dialogRef = this.dialog.open(ConfirmDialog, {
              width: '250px',
              data: { message: 'Agendamento realizado com sucesso!' }
            });
            dialogRef.afterClosed().subscribe(() => {
              console.log('sucess')
            });
          },
          (error: any) => {
            console.error('Error Updating Appointment:', error);
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
                // this.router.navigate(['/login']);
              }
            });
          }
        );
      } else {
        this.appointmentService.scheduleAppointment(newAppointment).subscribe(
          (response: any) => {
            console.log('New Appointment Created:', response);
          },
          (error: any) => {
            console.error('Error Creating Appointment:', error);
          }
        );
      }
    }
  }
}
