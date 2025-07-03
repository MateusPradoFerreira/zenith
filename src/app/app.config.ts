import { ApplicationConfig, EnvironmentProviders, importProvidersFrom, LOCALE_ID, Provider, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Bell, Calendar, CalendarRange, HelpCircle, Home, LucideAngularModule, Settings, BanknoteArrowDown, BanknoteArrowUp, Clock, ClockFading, SquareKanban, PiggyBank, HandCoins, ClipboardList, ClipboardPenLine, FolderOpen, LayoutDashboard, ChevronLeft, ChevronRight, Pin, PinOff, Origami, MessagesSquare, MessageSquareMore, MessageCircleMore, Funnel, Plus, FunnelPlus, Search, RefreshCcw, LoaderCircle, RotateCcw, EllipsisVertical, FolderClosed, ChartPie, Archive, PanelLeft, Trash2, CircleOff, Shrimp, ChevronsDown, ArrowDownUp, ListFilter, X, PencilLine, ArrowUpWideNarrow, ArrowDownWideNarrow, ArrowDownNarrowWide, ArrowUpDown, Sheet, LayoutGrid, Table, CircleX, Check, ListTodo, ChevronDown, CircleFadingArrowUp, DollarSign } from 'lucide-angular';
import { HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { InboxService } from './features/inbox/services/inbox.service';
import { InboxMockedService } from './features/inbox/services/inbox-mock.service';
import { PayableService } from './features/financial/services/payable.service';
import { PayableMockedService } from './features/financial/services/payable-mock.service';
import { SecrecyService } from './features/financial/services/secrecy.service';
import { SecrecyMockedService } from './features/financial/services/secrecy-mock.service';
import { PlanOfAccountService } from './features/financial/services/plan-of-account.service';
import { PlanOfAccountMockedService } from './features/financial/services/plan-of-account-mock.service';
import { CenterOfCostService } from './features/financial/services/center-of-cost.service';
import { CenterOfCostMockedService } from './features/financial/services/center-of-cost-mock.service';
import { ScheduleService } from './features/schedule/services/schedule.service';
import { ScheduleMockedService } from './features/schedule/services/schedule-mock.service';
import { ReceivableService } from './features/financial/services/receivable.service';
import { ReceivableMockedService } from './features/financial/services/receivable-mock.service';

registerLocaleData(localePt);

const services: (Provider | EnvironmentProviders)[] = [
  { provide: InboxService, useClass: InboxMockedService },
  { provide: PayableService, useClass: PayableMockedService },
  { provide: ReceivableService, useClass: ReceivableMockedService },
  { provide: SecrecyService, useClass: SecrecyMockedService },
  { provide: PlanOfAccountService, useClass: PlanOfAccountMockedService },
  { provide: CenterOfCostService, useClass: CenterOfCostMockedService },
  { provide: ScheduleService, useClass: ScheduleMockedService },
];

const lucideIcons = { Archive, Sheet, DollarSign, CircleFadingArrowUp, Shrimp, Trash2, ChevronDown, ListTodo, Check, ListFilter, X, CircleX, PencilLine, ArrowUpWideNarrow, ArrowDownWideNarrow, Table, ArrowDownNarrowWide, ArrowDownUp, ArrowUpDown,  CircleOff, EllipsisVertical, ChevronsDown, PanelLeft, ChartPie, FolderClosed, ClipboardPenLine, LoaderCircle, RotateCcw, RefreshCcw, Search, Plus, Funnel, FunnelPlus, Home, MessagesSquare, MessageSquareMore, MessageCircleMore, Origami, Calendar, CalendarRange, Settings, Bell, HelpCircle, BanknoteArrowDown, BanknoteArrowUp, Clock, ClockFading, SquareKanban, PiggyBank, HandCoins, LayoutGrid, ClipboardList, FolderOpen, LayoutDashboard, ChevronLeft, ChevronRight, Pin, PinOff };

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideRouter(routes), 
    provideEnvironmentNgxMask(),
    importProvidersFrom(HttpClientModule),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    importProvidersFrom(LucideAngularModule.pick(lucideIcons)),
    ...services,
  ],
};
