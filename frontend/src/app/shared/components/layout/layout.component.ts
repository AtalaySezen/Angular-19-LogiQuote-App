import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [NzBreadCrumbModule, RouterOutlet, RouterModule, NzIconModule, NzMenuModule, NzLayoutModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  authService = inject(AuthService);
  isCollapsed: boolean = false;


  logOut() {
    console.log("Çıkış yapıldı.")
    this.authService.LogOut();
  }
}
