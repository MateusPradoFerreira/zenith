import { Routes } from '@angular/router';
import { MainLayoutComponent } from './common/layouts/main-layout/main-layout.component';
import { PayableListingComponent } from './features/financial/views/payable/payable-listing/payable-listing.component';

export const routes: Routes = [
  { path: "", redirectTo: '/payables', pathMatch: 'full' },
  { path: "", component: MainLayoutComponent, children: [
    /* { path: "dashboard", component: DashboardComponent, data: { header: "Dashboard" } },
    { path: "inbox", component: InboxListingComponent, data: { header: "Inbox" } }, */
    { path: "payables", component: PayableListingComponent, data: { header: "Despesas" } },
    /* { path: "receivables", component: ReceivableListingComponent, data: { header: "Receitas" } },
    { path: "financial-registries", component: FinancialRegistriesPanelComponent, data: { header: "Cadastros de Financeiro" } },
    { path: "schedules", component: ScheduleListingComponent, data: { header: "Agenda" } },
    { path: "schedule-registries", component: ScheduleRegistriesPanelComponent, data: { header: "Cadastros da Agenda" }},
    { path: "cash-flow", component: CashFlowListingComponent, data: { header: "Fluxo de Caixa" }},
    { path: "goals", component: GoalListingComponent, data: { header: "Metas" }}, */
  ]},
];
