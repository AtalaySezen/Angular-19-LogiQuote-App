import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';
import { NotificationService } from '../../shared/services/notification.service';

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
  notificationService = inject(NotificationService);
  loaderService = inject(LoaderService);
  formBuilder = inject(NonNullableFormBuilder);
  router = inject(Router);

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
      this.authService.Register(this.RegisterForm.value.email!, this.RegisterForm.value.email!).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            this.notificationService.createNotification(data.status, '', data.message)
            this.router.navigate(['/login']);
          } else {
            this.notificationService.createNotification('Hata', '', data.message)
          }
        },
        error: (err) => {
          this.loaderService.hideLoader();
          if (err.error && err.error.message) {
            this.notificationService.createNotification('error', '', err.error.message);
          }
        },
        complete: () => {
          this.loaderService.hideLoader();
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
