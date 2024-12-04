import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OfferComponent } from './pages/offer/offer.component';
import { OfferListComponent } from './pages/offer-list/offer-list.component';

export const routes: Routes = [
    { path: 'offer', component: OfferComponent, title: 'Offer' },
    { path: 'offer-list', component: OfferListComponent, title: 'Offer Lists' },
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'register', component: RegisterComponent, title: 'Register' },
];
