import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, catchError, finalize } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
    const auth = inject(AuthService);
    const loaderService = inject(LoaderService);
    const token = auth.token;

    if (!request.url.includes('auth/login') && !request.url.includes('auth/register')) {
        if (token) {
            loaderService.showLoader();
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }
    } else {
        if (!/^(http|https):/i.test(request.url)) {
            request = request.clone({
                url: environment.apiUrl + request.url,
            });
        }
    }

    return next(request).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401 || err.status === 0) {
                auth.LogOut();
            } else {
                console.error('HTTP Error:', 'Hata Oluştu');
            }
            return new Observable<HttpEvent<any>>(observer => {
                observer.error(err);
                observer.complete();
            });
        }),
        finalize(() => {
            loaderService.hideLoader();
        })
    );
};