import { Component } from '@angular/core';
import { GlobalModule } from '../../../../core/modules/global-module.module';
import { InboxListingComponent } from '../../../inbox/views/inbox/inbox-listing/inbox-listing.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [GlobalModule, InboxListingComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {};