import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Offer, getDimensions } from '../models/general.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  http = inject(HttpClient);

  SaveOfferData(offer: Offer): Observable<any> {
    return this.http.post<Offer>(environment.apiUrl + `offers`, offer);
  }

  getDimensions() {
    return this.http.get<getDimensions>(environment.apiUrl + `offers/dimensions`);
  }

}
