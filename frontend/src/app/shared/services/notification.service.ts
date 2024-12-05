import { Injectable, inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification = inject(NzNotificationService)

  createNotification(type: string, header: string, message: string): void {
    this.notification.create(
      type,
      header,
      message
    );
  }
}
