import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthData } from '../models/auth.model';
import { Auth, General, TokenModel } from '../models/general.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  authLocalStorageToken = `${environment.appVersion}-${environment.APP_KEY}`;

  Login(email: string, password: string): Observable<Auth<AuthData>> {
    return this.http.post<Auth<AuthData>>(environment.apiUrl + 'auth/login',
      {
        email: email,
        password: password
      }
    )
  }

  Register(email: string, password: string): Observable<General<AuthData>> {
    return this.http.post<General<AuthData>>(environment.apiUrl + 'auth/register',
      {
        email: email,
        password: password
      }
    )
  }

  TokenIsValid(): Observable<TokenModel<null>> {
    return this.http.post<TokenModel<null>>(environment.apiUrl + 'token/tokenIsValid', {});
  }

  get token() {
    if (localStorage.getItem(`${this.authLocalStorageToken}`) != null) {
      return localStorage.getItem(`${this.authLocalStorageToken}`) || '';
    } if (sessionStorage.getItem(`${this.authLocalStorageToken}`) != null) {
      return sessionStorage.getItem(`${this.authLocalStorageToken}`) || '';
    } else {
      return '';
    }
  }

  CheckTokenIsValid() {
    this.TokenIsValid().subscribe({
      next: async (data) => {
        if (data.valid == true) {
          return true;
        } else {
          await this.LogOut();
          return false;
        }
      }, error: (err) => {
        this.LogOut();
        console.error(err);
      },
    });
  }


  async GuardAuth(): Promise<boolean> {
    if (this.token != '') {
      this.CheckTokenIsValid();
      return true;
    } else {
      await this.LogOut();
      return await false;
    }
  }

  checkUserToken() {
    if (this.token != '') {
      this.router.navigate(['offer']);
    }
  }

  //#region  Kullanıcı beni hatırla seçer ise LocalStorage'a kayıt eder
  SetLocalStorageToken(user: Auth<AuthData>) {
    return localStorage.setItem(`${this.authLocalStorageToken}`, user.token);
  }
  //#endregion

  //#region kullanıcı beni hatırla seçmez ise sessionStorage'a kayıt eder
  SetSessionStorageToken(user: Auth<AuthData>) {
    return sessionStorage.setItem(`${this.authLocalStorageToken}`, user.token);
  }
  //#endregion

  LogOut() {
    localStorage.removeItem(`${this.authLocalStorageToken}`);
    sessionStorage.removeItem(`${this.authLocalStorageToken}`);
    this.router.navigate(['/login']);
  }
}
