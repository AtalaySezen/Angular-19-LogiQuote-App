import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    CommonModule,
    RouterModule,
    NzFormModule,
    NzInputModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  authService = inject(AuthService);
  formBuilder = inject(NonNullableFormBuilder);
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  RegisterForm = this.formBuilder.group({
    email: this.formBuilder.control('', [Validators.required, Validators.email]),
    password: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
    confirmPassword: this.formBuilder.control('', [Validators.required, this.confirmPasswordValidator.bind(this)])
  },
    { validators: this.passwordsMatchValidator }
  );


  confirmPasswordValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = this.RegisterForm?.get('password')?.value;
    const confirmPassword = control.value;

    return password && confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
  }

  submitRegisterForm(): void {
    if (this.RegisterForm.valid) {
      // this.authService.Login(this.RegisterForm.value.email!, this.RegisterForm.value.password!)
      console.log(this.RegisterForm);
    } else {
      Object.values(this.RegisterForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }

    return null;
  }


  getPasswordError(): string {
    const passwordControl = this.RegisterForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    } else if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 3 characters';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    const confirmPasswordControl = this.RegisterForm.get('confirmPassword');

    if (confirmPasswordControl?.hasError('required')) {
      return 'Confirm Password is required';
    }

    if (this.RegisterForm.hasError('passwordsMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  togglePasswordVisibility(fieldId: string): void {
    if (fieldId === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
    } else if (fieldId === 'confirmPassword') {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }
  }


}
