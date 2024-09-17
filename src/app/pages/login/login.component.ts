import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/components/dialog/dialog.component';
import { DialogErrorComponent } from 'src/app/components/dialog-error/dialog-error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  cadastroForm: FormGroup;
  loginForm: FormGroup;
  isForgetPassword!: boolean;
  errorMessage: string | null = null;
  forgetPasswordForm: FormGroup;

  constructor(private usuarioService: UsuarioService, private router: Router, private dialog: MatDialog) {
    // Ajustar cadastroForm para incluir os campos conforme o DTO InsertUserRequesterDto
    this.cadastroForm = new FormGroup({
      nmUser: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, this.passwordStrengthValidator()]),
      confirmPassword: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required])  // Este campo faz parte dos contatos
    }, { validators: this.passwordMatchValidator });

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    this.forgetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.cadastroForm.get('phoneNumber')?.valueChanges.subscribe(value => {
      this.formatPhoneNumber(value);
    });
  }

  formatPhoneNumber(value: string) {
    if (!value) return;
    value = value.replace(/\D/g, '');
  
    if (value.length > 11) {
      value = value.slice(0, 11); 
    }

    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    this.cadastroForm.get('phoneNumber')?.setValue(value, { emitEvent: false });
  }
  

  ngOnInit(){
 
  }

  resetToken(){
    const token = localStorage.getItem('token');

    if (token) {
      localStorage.removeItem('token');
      console.log('Token removido com sucesso.');
    }
  }

  cadastrar() {
    if (this.cadastroForm.valid) {
      // Ajustar os dados de cadastro para corresponder ao DTO InsertUserRequesterDto
      const userData = {
        nmUser: this.cadastroForm.value.nmUser,
        email: this.cadastroForm.value.email,
        password: this.cadastroForm.value.password,
        cpf: this.cadastroForm.value.cpf,
        contacts: [{ 
          type: 'T', 
          contactValue: this.cadastroForm.value.phoneNumber 
        }]
      };

      this.usuarioService.registerUser(userData).subscribe({
        next: (response) => {
          this.errorMessage = null;
          this.cadastroForm.reset();
          console.log('Usuário cadastrado com sucesso!', response);

          const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '250px',
            data: { message: "Usuário cadastrado! Realize seu login" }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.router.navigate(['/login']);
            }
          });

        },
        error: (error) => {
          console.error('Erro ao cadastrar usuário', error);
          this.errorMessage = 'Erro ao cadastrar usuário. Por favor, tente novamente.';
          this.modalDeErro(error.error.details);
        }
      });
    }
  }

  login() {
    if (this.loginForm.valid) {
      const userData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
  
      this.usuarioService.loginUser(userData).subscribe({
        next: (response) => {
          if (response.token) {
            this.errorMessage = null;
            localStorage.setItem('token', response.token);
  
            const roles = response.roles;
            if (roles && roles.some((role: any) => role.name === 'ROLE_USER_ADMIN')) {
              localStorage.setItem('permission', 'ADMIN');
            } else {
              localStorage.setItem('permission', 'USER');
            }
            this.router.navigate(['/painel']);
          }
          console.log('Login realizado com sucesso!', response);
        },
        error: (error) => {
          console.error('Erro ao realizar login', error);
          this.errorMessage = 'Erro ao realizar login. Por favor, tente novamente.';
          this.modalDeErro(error.error.details);
        }
      });
    }
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
        passwordStrength: 'Para sua segurança, sua senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.'
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

  recuperarSenha() {
    if (this.forgetPasswordForm.valid) {
      const email = this.forgetPasswordForm.value.email;
      this.usuarioService.resetPassword({ email }).subscribe({
        next: (response) => {
          const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '250px',
            data: { message: 'Um e-mail de recuperação de senha foi enviado. Por favor, verifique seu e-mail.' }
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          console.error('Erro ao enviar e-mail de recuperação de senha', error);
          this.errorMessage = 'Erro ao enviar e-mail de recuperação de senha. Por favor, tente novamente.';
          this.modalDeErro(error.error.details);
        }
      });
    }
  }

  
  esqueciSenha(isForgetPassword: boolean) {
    this.errorMessage = null;
    this.isForgetPassword = isForgetPassword;
  }

  modalDeErro(responseError: string) {
    const dialogRef = this.dialog.open(DialogErrorComponent, {
      width: '250px',
      data: { message: responseError }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/login']);
      }
    });
  }
}
