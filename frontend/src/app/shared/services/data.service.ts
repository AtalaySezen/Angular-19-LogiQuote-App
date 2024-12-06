import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Offer, QueryPageSize, getDimensions } from '../models/general.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  http = inject(HttpClient);
  cacheService = inject(CacheService);

  SaveOfferData(offer: Offer): Observable<any> {
    this.cacheService.clear('offers-page-1-size-5');
    return this.http.post<Offer>(environment.apiUrl + `offers`, offer);
  }

  GetDimensions() {
    return this.http.get<getDimensions>(environment.apiUrl + `offers/dimensions`);
  }

  GetOffers(parameters: QueryPageSize = { page: 1, size: 5 }): Observable<Offer> {
    const cacheKey = `offers-page-${parameters.page}-size-${parameters.size}`;
    const cachedData = this.cacheService.get(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<Offer>(environment.apiUrl + `offers/?page=${parameters.page}&limit=${parameters.size}`).pipe(
      tap(data => this.cacheService.set(cacheKey, data))
    );
  }

}
