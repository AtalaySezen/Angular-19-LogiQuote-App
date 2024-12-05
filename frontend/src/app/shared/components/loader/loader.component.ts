import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule, NzSpinModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  isLoader$: Observable<boolean> = new Observable<false>;
  loaderService = inject(LoaderService);

  ngOnInit(): void {
    this.isLoader$ = this.loaderService.isLoading;
  }

}
