import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthData } from '../models/auth.model';
import { Auth, General } from '../models/general.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  Login(email: string, password: string): Observable<Auth<AuthData>> {
    return this.http.post<Auth<AuthData>>(environment.apiUrl + '',
      {
        email: email,
        password: password
      }
    )
  }

  Register(email: string, password: string): Observable<General<AuthData>> {
    return this.http.post<General<AuthData>>(environment.apiUrl + '',
      {
        email: email,
        password: password
      }
    )
  }


  LogOut(){
    
  }

}
