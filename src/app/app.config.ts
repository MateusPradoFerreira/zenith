import { ApplicationConfig, EnvironmentProviders, importProvidersFrom, LOCALE_ID, Provider, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Bell, Calendar, CalendarRange, HelpCircle, Home, LucideAngularModule, Settings, ChevronsUpDown, BanknoteArrowDown, BanknoteArrowUp, Clock, AlarmClockPlus, ClockFading, SquareKanban, PiggyBank, HandCoins, ClipboardList, ClipboardPenLine, FolderOpen, LayoutDashboard, ChevronLeft, ChevronRight, Pin, PinOff, Origami, MessagesSquare, MessageSquareMore, MessageCircleMore, Funnel, Plus, FunnelPlus, Search, RefreshCcw, LoaderCircle, RotateCcw, EllipsisVertical, FolderClosed, ChartPie, Archive, PanelLeft, Trash2, CircleOff, Shrimp, ChevronsDown, ArrowDownUp, ListFilter, X, PencilLine, ArrowUpWideNarrow, ArrowDownWideNarrow, ArrowDownNarrowWide, ArrowUpDown, Sheet, LayoutGrid, Table, CircleX, Check, ListTodo, ChevronDown, CircleFadingArrowUp, DollarSign, ShoppingCart, Menu, LogOut, BookOpenText, Headset, Monitor, MoonStar, Sun, Goal, ChevronUp, TrendingUp, TrendingDown, Timer, Hourglass, ArrowLeftRight, PanelRightDashed, PanelLeftDashed, PanelLeftClose, PanelLeftOpen, Eye, EyeClosed, EyeOff, Ellipsis, ChevronsDownUp, CalendarArrowUp, CalendarArrowDown } from 'lucide-angular';
import { HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { PayableService } from './features/financial/services/payable.service';
import { PayableMockService } from './features/financial/services/mock/payable-mock.service';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ReceivableService } from './features/financial/services/receivable.service';
import { ReceivableMockService } from './features/financial/services/mock/receivable-mock.service';
import { CashFlowMockService } from './features/financial/services/mock/cash-flow-mock.service';
import { CashFlowService } from './features/financial/services/cash-flow.service';
import { CenterOfCostMockService } from './features/financial/services/mock/center-of-cost-mock.service';
import { SecrecyMockService } from './features/financial/services/mock/secrecy-mock.service';
import { CenterOfCostService } from './features/financial/services/center-of-cost.service';
import { SecrecyService } from './features/financial/services/secrecy.service';
import { PlanOfAccountMockService } from './features/financial/services/mock/plan-of-account-mock.service';
import { PlanOfAccountService } from './features/financial/services/plan-of-account.service';
import { BankAccountMockService } from './features/financial/services/mock/bank-account-mock.service';
import { BankAccountService } from './features/financial/services/bank-account.service';
import { InboxMockService } from './features/inbox/services/mock/inbox-mock.service';
import { InboxService } from './features/inbox/services/inbox.service';
import { ScheduleService } from './features/schedule/services/schedule.service';
import { ScheduleCategoryService } from './features/schedule/services/schedule-category.service';
import { ScheduleMockService } from './features/schedule/services/mock/schedule-mock.service';
import { ScheduleCategoryMockService } from './features/schedule/services/mock/schedule-category-mock.service';
import { RecurrenceService } from './features/schedule/services/recurrence.service';
import { RecurrenceMockService } from './features/schedule/services/mock/recurrence-mock.service';

registerLocaleData(localePt);

const services: (Provider | EnvironmentProviders)[] = [
  { provide: InboxService, useClass: InboxMockService },
  { provide: PayableService, useClass: PayableMockService },
  { provide: ReceivableService, useClass: ReceivableMockService },
  { provide: CashFlowService, useClass: CashFlowMockService },
  { provide: CenterOfCostService, useClass: CenterOfCostMockService },
  { provide: SecrecyService, useClass: SecrecyMockService },
  { provide: PlanOfAccountService, useClass: PlanOfAccountMockService },
  { provide: BankAccountService, useClass: BankAccountMockService },
  { provide: ScheduleService, useClass: ScheduleMockService },
  { provide: ScheduleCategoryService, useClass: ScheduleCategoryMockService },
  { provide: RecurrenceService, useClass: RecurrenceMockService },
];

const lucideIcons = { Archive, Sheet, Timer, ChevronsUpDown, ChevronsDownUp, CalendarArrowUp, CalendarArrowDown, Hourglass, PanelLeftClose, Eye, EyeOff, Ellipsis, EyeClosed, PanelLeftOpen, AlarmClockPlus, PanelRightDashed, PanelLeftDashed, TrendingUp, TrendingDown, ShoppingCart, Goal, Menu, DollarSign, ChevronDown, ChevronLeft, ChevronRight, ArrowLeftRight, ChevronUp, LogOut, BookOpenText, Headset, Monitor, Sun, MoonStar, CircleFadingArrowUp, Shrimp, Trash2, ListTodo, Check, ListFilter, X, CircleX, PencilLine, ArrowUpWideNarrow, ArrowDownWideNarrow, Table, ArrowDownNarrowWide, ArrowDownUp, ArrowUpDown,  CircleOff, EllipsisVertical, ChevronsDown, PanelLeft, ChartPie, FolderClosed, ClipboardPenLine, LoaderCircle, RotateCcw, RefreshCcw, Search, Plus, Funnel, FunnelPlus, Home, MessagesSquare, MessageSquareMore, MessageCircleMore, Origami, Calendar, CalendarRange, Settings, Bell, HelpCircle, BanknoteArrowDown, BanknoteArrowUp, Clock, ClockFading, SquareKanban, PiggyBank, HandCoins, LayoutGrid, ClipboardList, FolderOpen, LayoutDashboard, Pin, PinOff };

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
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
