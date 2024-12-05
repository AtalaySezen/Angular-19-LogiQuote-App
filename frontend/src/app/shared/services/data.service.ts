import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Offer, QueryPageSize, getDimensions } from '../models/general.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  http = inject(HttpClient);

  SaveOfferData(offer: Offer): Observable<any> {
    return this.http.post<Offer>(environment.apiUrl + `offers`, offer);
  }

  GetDimensions() {
    return this.http.get<getDimensions>(environment.apiUrl + `offers/dimensions`);
  }

  GetOffers(parameters: QueryPageSize = { page: 1, size: 12 }) {
    return this.http.get<Offer>(environment.apiUrl + `offers/?page=${parameters.page}&limit=${parameters.size}`);
  }

}
