import { Component, inject } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DataService } from '../../shared/services/data.service';
import { Offer } from '../../shared/models/general.model';
import { NotificationService } from '../../shared/services/notification.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-offer-list',
  imports: [NzTableModule, NzPaginationModule],
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.scss'
})
export class OfferListComponent {
  dataService = inject(DataService);
  NotificationService = inject(NotificationService);
  offerList: Offer[] = [];

  totalItemCount: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 8;

  ngOnInit() {
    this.getAllOffers();
  }

  getAllOffers() {
    this.dataService.GetOffers({ page: this.currentPage, size: this.pageSize }).subscribe({
      next: (data: Offer) => {
        if (data.status === 'success') {
          this.totalPages = data.data.totalPages;
          this.totalItemCount = data.data.totalItemCount;
          this.offerList = data.data.offers;
        } else {
          this.NotificationService.createNotification('error', 'Error', 'Error');
        }
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getAllOffers();
  }

}
