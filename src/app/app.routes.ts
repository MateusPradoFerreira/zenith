import { Routes } from '@angular/router';
import { MainLayoutComponent } from './common/layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/views/dashboard/dashboard.component';
import { InboxListingComponent } from './features/inbox/views/inbox/inbox-listing/inbox-listing.component';
import { PayableListingComponent } from './features/financial/views/payable/payable-listing/payable-listing.component';
import { FinancialRegistriesPanelComponent } from './features/financial/views/financial-registries-panel/financial-registries-panel.component';
import { ScheduleListingComponent } from './features/schedule/views/schedule/schedule-listing/schedule-listing.component';
import { ReceivableListingComponent } from './features/financial/views/receivable/receivable-listing/receivable-listing.component';

export const routes: Routes = [
  { path: "", redirectTo: '/dashboard', pathMatch: 'full' },
  { path: "", component: MainLayoutComponent, children: [
    { path: "dashboard", component: DashboardComponent },
    { path: "inbox", component: InboxListingComponent },
    { path: "payables", component: PayableListingComponent },
    { path: "receivables", component: ReceivableListingComponent },
    { path: "financial-registries", component: FinancialRegistriesPanelComponent },
    { path: "schedules", component: ScheduleListingComponent },
  ]},
];
