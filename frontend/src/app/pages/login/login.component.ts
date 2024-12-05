import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NzButtonModule, NzIconModule, CommonModule, RouterModule, NzCheckboxModule, NzFormModule, NzInputModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authService = inject(AuthService);
  loaderService = inject(LoaderService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  formBuilder = inject(NonNullableFormBuilder);

  isPasswordVisible: boolean = false;

  loginForm = this.formBuilder.group({
    email: this.formBuilder.control('', [Validators.required, Validators.email]),
    password: this.formBuilder.control('', [Validators.required, Validators.minLength(3)]),
    remember: this.formBuilder.control(true)
  });

  submitLoginForm(): void {
    this.loaderService.showLoader();
    if (this.loginForm.valid) {
      this.authService.Login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            if (this.loginForm.get('remember')?.value) {
              this.authService.SetLocalStorageToken(data);
            } else {
              this.authService.SetSessionStorageToken(data);
            }
            this.notificationService.createNotification(data.status, '', data.message)
            this.loaderService.hideLoader();
            this.router.navigate(['/offer']);
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

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  getPasswordError(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    } else if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 3 characters';
    }
    return '';
  }
}
