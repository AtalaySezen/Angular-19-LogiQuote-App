import { Component, inject } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DataService } from '../../shared/services/data.service';
import { Offer } from '../../shared/models/general.model';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-offer-list',
  imports: [NzTableModule],
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.scss'
})
export class OfferListComponent {
  dataService = inject(DataService);
  NotificationService = inject(NotificationService);
  offerList: Offer[] = [];
  pageSize = 10;
  pageIndex = 1;
  total = 1;

  ngOnInit() {
    this.getAllOffers();
  }

  getAllOffers() {
    this.dataService.GetOffers().subscribe({
      next: (data: Offer) => {
        if (data.status === 'success') {
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

}
