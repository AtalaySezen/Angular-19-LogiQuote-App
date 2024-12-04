import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OfferComponent } from './pages/offer/offer.component';
import { OfferListComponent } from './pages/offer-list/offer-list.component';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/offer', pathMatch: 'full' },
    {
        path: '',
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ],
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'offer', component: OfferComponent },
            { path: 'offer-list', component: OfferListComponent },
        ],
    }
];

