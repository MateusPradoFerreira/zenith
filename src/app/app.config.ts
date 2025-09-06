import { ApplicationConfig, EnvironmentProviders, importProvidersFrom, LOCALE_ID, Provider, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Bell, Calendar, CalendarRange, HelpCircle, Home, LucideAngularModule, Settings, BanknoteArrowDown, BanknoteArrowUp, Clock, AlarmClockPlus, ClockFading, SquareKanban, PiggyBank, HandCoins, ClipboardList, ClipboardPenLine, FolderOpen, LayoutDashboard, ChevronLeft, ChevronRight, Pin, PinOff, Origami, MessagesSquare, MessageSquareMore, MessageCircleMore, Funnel, Plus, FunnelPlus, Search, RefreshCcw, LoaderCircle, RotateCcw, EllipsisVertical, FolderClosed, ChartPie, Archive, PanelLeft, Trash2, CircleOff, Shrimp, ChevronsDown, ArrowDownUp, ListFilter, X, PencilLine, ArrowUpWideNarrow, ArrowDownWideNarrow, ArrowDownNarrowWide, ArrowUpDown, Sheet, LayoutGrid, Table, CircleX, Check, ListTodo, ChevronDown, CircleFadingArrowUp, DollarSign, ShoppingCart, Menu, LogOut, BookOpenText, Headset, Monitor, MoonStar, Sun, Goal, ChevronUp, TrendingUp, TrendingDown, Timer, Hourglass, ArrowLeftRight, PanelRightDashed, PanelLeftDashed, PanelLeftClose, PanelLeftOpen, Eye, EyeClosed, EyeOff, Ellipsis } from 'lucide-angular';
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
import { ScheduleCategoryService } from './features/schedule/services/schedule-category.service';
import { ScheduleCategoryMockedService } from './features/schedule/services/schedule-category-mock.service';
import { BankAccountService } from './features/financial/services/bank-account.service';
import { BankAccountMockedService } from './features/financial/services/bank-account-mock.service';
import { CashFlowService } from './features/financial/services/cash-flow.service';
import { CashFlowMockedService } from './features/financial/services/cash-flow-mock.service';
import { GoalService } from './features/goal/services/goal.service';
import { GoalMockedService } from './features/goal/services/goal-mock.service';
import { GoalTaskService } from './features/goal/services/goal-task.service';
import { GoalItemService } from './features/goal/services/goal-item.service';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { CalendarUtils, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

registerLocaleData(localePt);

const services: (Provider | EnvironmentProviders)[] = [
  { provide: InboxService, useClass: InboxMockedService },
  { provide: PayableService, useClass: PayableMockedService },
  { provide: ReceivableService, useClass: ReceivableMockedService },
  { provide: SecrecyService, useClass: SecrecyMockedService },
  { provide: PlanOfAccountService, useClass: PlanOfAccountMockedService },
  { provide: CenterOfCostService, useClass: CenterOfCostMockedService },
  { provide: ScheduleService, useClass: ScheduleMockedService },
  { provide: ScheduleCategoryService, useClass: ScheduleCategoryMockedService },
  { provide: BankAccountService, useClass: BankAccountMockedService },
  { provide: CashFlowService, useClass: CashFlowMockedService },
  { provide: GoalService, useClass: GoalMockedService },
  { provide: GoalTaskService, useClass: GoalTaskService },
  { provide: GoalItemService, useClass: GoalItemService },
];

const lucideIcons = { Archive, Sheet, Timer, Hourglass, PanelLeftClose, Eye, EyeOff, Ellipsis, EyeClosed, PanelLeftOpen, AlarmClockPlus, PanelRightDashed, PanelLeftDashed, TrendingUp, TrendingDown, ShoppingCart, Goal, Menu, DollarSign, ChevronDown, ChevronLeft, ChevronRight, ArrowLeftRight, ChevronUp, LogOut, BookOpenText, Headset, Monitor, Sun, MoonStar, CircleFadingArrowUp, Shrimp, Trash2, ListTodo, Check, ListFilter, X, CircleX, PencilLine, ArrowUpWideNarrow, ArrowDownWideNarrow, Table, ArrowDownNarrowWide, ArrowDownUp, ArrowUpDown,  CircleOff, EllipsisVertical, ChevronsDown, PanelLeft, ChartPie, FolderClosed, ClipboardPenLine, LoaderCircle, RotateCcw, RefreshCcw, Search, Plus, Funnel, FunnelPlus, Home, MessagesSquare, MessageSquareMore, MessageCircleMore, Origami, Calendar, CalendarRange, Settings, Bell, HelpCircle, BanknoteArrowDown, BanknoteArrowUp, Clock, ClockFading, SquareKanban, PiggyBank, HandCoins, LayoutGrid, ClipboardList, FolderOpen, LayoutDashboard, Pin, PinOff };

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
    { provide: DateAdapter, useFactory: adapterFactory },
    ...services,
  ],
};
