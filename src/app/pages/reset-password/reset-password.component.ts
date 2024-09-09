import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogErrorComponent } from 'src/app/components/dialog-error/dialog-error.component';
import { ConfirmDialog } from 'src/app/components/dialog/dialog.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { isHttpFailureResponse } from 'src/app/utils/error.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  cadastroForm: FormGroup;
  errorMessage: string | null = null;
  token: string = '';
  
  constructor(private usuarioService: UsuarioService, private router: Router, private dialog: MatDialog, private route: ActivatedRoute) {
    this.cadastroForm = new FormGroup({
      password: new FormControl('', [Validators.required, this.passwordStrengthValidator()]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log(this.token);
    });
  }

  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecial = /[\W_]+/.test(value);
      const isValidLength = value.length >= 8;
      if (hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && isValidLength) {
        return null;
      }
      return {
        passwordStrength: '  Para sua segurança, sua senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.'
      };
    };
  }

  showPasswordMismatchError(): boolean {
    const passwordControl = this.cadastroForm.get('password');
    const confirmPasswordControl = this.cadastroForm.get('confirmPassword');
    return this.cadastroForm.errors?.['passwordMismatch'] &&
      (passwordControl?.touched || confirmPasswordControl?.touched);
  }

  showPasswordStrengthError(): boolean {
    const passwordControl = this.cadastroForm.get('password');
    return passwordControl?.value?.length > 0 && passwordControl?.errors?.['passwordStrength'];
  }

  resetPassword() {
    if (this.cadastroForm.valid) {
      const newPassword = this.cadastroForm.get('password')?.value;
      const confirmPassword = this.cadastroForm.get('confirmPassword')?.value;
      
      this.usuarioService.confirmResetPassword(this.token, newPassword).subscribe({
        next: (response) => {
          this.errorMessage = null;
          this.cadastroForm.reset();
          console.log('Senha redefinida com sucesso!', response);

          const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '250px',
            data: { message: "Senha redefinida com sucesso!" }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.router.navigate(['/login']);
            }
          });

        },
        error: (error) => {
          console.error('Erro ao redefinir senha', error);
          this.errorMessage = 'Erro ao redefinir senha. Por favor, tente novamente.';

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
              this.router.navigate(['/login']);
            }
          });
        }
      });
    }
  }
}
