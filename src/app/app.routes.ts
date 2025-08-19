import { Routes } from '@angular/router';
import { MainLayoutComponent } from './common/layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/views/dashboard/dashboard.component';
import { InboxListingComponent } from './features/inbox/views/inbox/inbox-listing/inbox-listing.component';
import { PayableListingComponent } from './features/financial/views/payable/payable-listing/payable-listing.component';
import { FinancialRegistriesPanelComponent } from './features/financial/views/financial-registries-panel/financial-registries-panel.component';
import { ScheduleListingComponent } from './features/schedule/views/schedule/schedule-listing/schedule-listing.component';
import { ReceivableListingComponent } from './features/financial/views/receivable/receivable-listing/receivable-listing.component';
import { ScheduleRegistriesPanelComponent } from './features/schedule/views/schedule-registries-panel/schedule-registries-panel.component';
import { CashFlowListingComponent } from './features/financial/views/cash-flow/cash-flow-listing/cash-flow-listing.component';

export const routes: Routes = [
  { path: "", redirectTo: '/dashboard', pathMatch: 'full' },
  { path: "", component: MainLayoutComponent, children: [
    { path: "dashboard", component: DashboardComponent, data: { header: "Dashboard" } },
    { path: "inbox", component: InboxListingComponent, data: { header: "Inbox" } },
    { path: "payables", component: PayableListingComponent, data: { header: "Despesas" } },
    { path: "receivables", component: ReceivableListingComponent, data: { header: "Receitas" } },
    { path: "financial-registries", component: FinancialRegistriesPanelComponent, data: { header: "Cadastros de Financeiro" } },
    { path: "schedules", component: ScheduleListingComponent, data: { header: "Agenda" } },
    { path: "schedule-registries", component: ScheduleRegistriesPanelComponent, data: { header: "Cadastros da Agenda" }},
    { path: "cash-flow", component: CashFlowListingComponent, data: { header: "Fluxo de Caixa" }},
  ]},
];
