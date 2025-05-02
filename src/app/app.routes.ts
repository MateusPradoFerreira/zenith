import { Routes } from '@angular/router';
import { MainLayoutComponent } from './common/layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/view/dashboard/dashboard.component';
import { PayableListComponent } from './features/financial/view/payable/payable-list/payable-list.component';
import { FinancialRegistriesComponent } from './features/financial/view/financial-registries/financial-registries.component';

export const routes: Routes = [
  { path: "", redirectTo: '/dashboard', pathMatch: 'full' },
  { path: "", component: MainLayoutComponent, children: [
    { path: "dashboard", component: DashboardComponent },
    { path: "payables", component: PayableListComponent },
    { path: "financial-registries", component: FinancialRegistriesComponent },
  ]},
];
