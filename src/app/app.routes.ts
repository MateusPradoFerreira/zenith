import { Routes } from '@angular/router';
import { MainLayoutComponent } from './common/layouts/main-layout/main-layout.component';
import { PayableListingComponent } from './features/financial/views/payable/payable-listing/payable-listing.component';
import { ReceivableListingComponent } from './features/financial/views/receivable/receivable-listing/receivable-listing.component';
import { CashFlowListingComponent } from './features/financial/views/cash-flow/cash-flow-listing/cash-flow-listing.component';
import { FinancialRegistriesPanelComponent } from './features/financial/views/financial-registries-panel/financial-registries-panel.component';
import { DashboardComponent } from './features/dashboard/views/dashboard/dashboard.component';
import { InboxListingComponent } from './features/inbox/views/inbox/inbox-listing/inbox-listing.component';
import { ScheduleListingComponent } from './features/schedule/views/schedule/schedule-listing/schedule-listing.component';
import { FinancialRecurrenceListingComponent } from './features/financial/views/financial-recurrence/financial-recurrence-listing/financial-recurrence-listing.component';
import { AuthLayoutComponent } from './common/layouts/auth-layout/auth-layout.component';
import { SignInFormComponent } from './features/auth/views/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from './features/auth/views/sign-up-form/sign-up-form.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { authLayoutGuard } from './features/auth/guards/auth-layout.guard';

export const routes: Routes = [
  { path: "", redirectTo: '/auth/sign-in', pathMatch: 'full' },
  { path: "auth", component: AuthLayoutComponent, canActivate: [authLayoutGuard], children: [
    { path: "sign-in", component: SignInFormComponent },
    { path: "sign-up", component: SignUpFormComponent },
  ]},
  { path: "", component: MainLayoutComponent, canActivate: [authGuard], children: [
    { path: "dashboard", component: DashboardComponent, data: { header: "Dashboard" } },
    { path: "inbox", component: InboxListingComponent, data: { header: "Inbox" } }, 
    { path: "payables", component: PayableListingComponent, data: { header: "Despesas" } },
    { path: "receivables", component: ReceivableListingComponent, data: { header: "Receitas" } },
    { path: "cash-flow", component: CashFlowListingComponent, data: { header: "Fluxo de Caixa" }},
    { path: "registries", component: FinancialRegistriesPanelComponent, data: { header: "Cadastros" } },
    { path: "schedules", component: ScheduleListingComponent, data: { header: "Agenda" } },
    { path: "financial-recurrences", component: FinancialRecurrenceListingComponent, data: { header: "Recorrência Financeira" } },
  ]},
];
