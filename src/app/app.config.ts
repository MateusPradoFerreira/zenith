import { APP_INITIALIZER, ApplicationConfig, EnvironmentProviders, importProvidersFrom, LOCALE_ID, Provider, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Bell, Calendar, CalendarRange, HelpCircle, Home, LucideAngularModule, Settings, ChevronsUpDown, BanknoteArrowDown, BanknoteArrowUp, Clock, AlarmClockPlus, ClockFading, SquareKanban, PiggyBank, HandCoins, ClipboardList, ClipboardPenLine, FolderOpen, LayoutDashboard, ChevronLeft, ChevronRight, Pin, PinOff, Origami, MessagesSquare, MessageSquareMore, MessageCircleMore, Funnel, Plus, FunnelPlus, Search, RefreshCcw, LoaderCircle, RotateCcw, EllipsisVertical, FolderClosed, ChartPie, Archive, PanelLeft, Trash2, CircleOff, Shrimp, ChevronsDown, ArrowDownUp, ListFilter, X, PencilLine, ArrowUpWideNarrow, ArrowDownWideNarrow, ArrowDownNarrowWide, ArrowUpDown, Sheet, LayoutGrid, Table, CircleX, Check, ListTodo, ChevronDown, CircleFadingArrowUp, DollarSign, ShoppingCart, Menu, LogOut, BookOpenText, Headset, Monitor, MoonStar, Sun, Goal, ChevronUp, TrendingUp, TrendingDown, Timer, Hourglass, ArrowLeftRight, PanelRightDashed, PanelLeftDashed, PanelLeftClose, PanelLeftOpen, Eye, EyeClosed, EyeOff, Ellipsis, ChevronsDownUp, CalendarArrowUp, CalendarArrowDown, Facebook, Github, TriangleAlert, CalendarSync } from 'lucide-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { PayableService } from './features/financial/services/payable.service';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ReceivableService } from './features/financial/services/receivable.service';
import { CashFlowService } from './features/financial/services/cash-flow.service';
import { CenterOfCostService } from './features/financial/services/center-of-cost.service';
import { SecrecyService } from './features/financial/services/secrecy.service';
import { PlanOfAccountService } from './features/financial/services/plan-of-account.service';
import { BankAccountService } from './features/financial/services/bank-account.service';
import { InboxService } from './features/inbox/services/inbox.service';
import { ScheduleService } from './features/schedule/services/schedule.service';
import { ScheduleCategoryService } from './features/schedule/services/schedule-category.service';
import { RecurrenceService } from './features/schedule/services/recurrence.service';
import { FinancialRecurrenceService } from './features/financial/services/financial-recurrence.service';
import { AuthFacade } from './features/auth/facades/auth.facade';
import { AuthService } from './features/auth/services/auth.service';
import { AuthInterceptor } from './features/interceptors/auth.interceptior';

registerLocaleData(localePt);

const services: (Provider | EnvironmentProviders)[] = [
  { provide: AuthService, useClass: AuthService },
  { provide: InboxService, useClass: InboxService },
  { provide: PayableService, useClass: PayableService },
  { provide: ReceivableService, useClass: ReceivableService },
  { provide: CashFlowService, useClass: CashFlowService },
  { provide: CenterOfCostService, useClass: CenterOfCostService },
  { provide: SecrecyService, useClass: SecrecyService },
  { provide: PlanOfAccountService, useClass: PlanOfAccountService },
  { provide: BankAccountService, useClass: BankAccountService },
  { provide: ScheduleService, useClass: ScheduleService },
  { provide: ScheduleCategoryService, useClass: ScheduleCategoryService },
  { provide: RecurrenceService, useClass: RecurrenceService },
  { provide: FinancialRecurrenceService, useClass: FinancialRecurrenceService },
];

export function initAuth(authFacade: AuthFacade) {
  return async () => await authFacade.validateAuth(); 
}

const lucideIcons = { Archive, Sheet, Timer, CalendarSync, Github, TriangleAlert, Facebook, ChevronsUpDown, ChevronsDownUp, CalendarArrowUp, CalendarArrowDown, Hourglass, PanelLeftClose, Eye, EyeOff, Ellipsis, EyeClosed, PanelLeftOpen, AlarmClockPlus, PanelRightDashed, PanelLeftDashed, TrendingUp, TrendingDown, ShoppingCart, Goal, Menu, DollarSign, ChevronDown, ChevronLeft, ChevronRight, ArrowLeftRight, ChevronUp, LogOut, BookOpenText, Headset, Monitor, Sun, MoonStar, CircleFadingArrowUp, Shrimp, Trash2, ListTodo, Check, ListFilter, X, CircleX, PencilLine, ArrowUpWideNarrow, ArrowDownWideNarrow, Table, ArrowDownNarrowWide, ArrowDownUp, ArrowUpDown,  CircleOff, EllipsisVertical, ChevronsDown, PanelLeft, ChartPie, FolderClosed, ClipboardPenLine, LoaderCircle, RotateCcw, RefreshCcw, Search, Plus, Funnel, FunnelPlus, Home, MessagesSquare, MessageSquareMore, MessageCircleMore, Origami, Calendar, CalendarRange, Settings, Bell, HelpCircle, BanknoteArrowDown, BanknoteArrowUp, Clock, ClockFading, SquareKanban, PiggyBank, HandCoins, LayoutGrid, ClipboardList, FolderOpen, LayoutDashboard, Pin, PinOff };

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: APP_INITIALIZER, useFactory: initAuth, deps: [AuthFacade], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideRouter(routes), 
    provideEnvironmentNgxMask(),
    importProvidersFrom(HttpClientModule),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    importProvidersFrom(LucideAngularModule.pick(lucideIcons)),
    BrowserAnimationsModule,
    provideAnimations(),
    CurrencyPipe,
    { provide: DateAdapter, useFactory: adapterFactory },
    ...services,
  ],
};
