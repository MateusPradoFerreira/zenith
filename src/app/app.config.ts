import { ApplicationConfig, EnvironmentProviders, importProvidersFrom, LOCALE_ID, Provider, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Bell, Calendar, CalendarRange, HelpCircle, Home, LucideAngularModule, Settings, BanknoteArrowDown, BanknoteArrowUp, Clock, ClockFading, SquareKanban, PiggyBank, HandCoins, ClipboardList, ClipboardPenLine, FolderOpen, LayoutDashboard, ChevronLeft, ChevronRight, Pin, PinOff, Origami, MessagesSquare, MessageSquareMore, MessageCircleMore, Funnel, Plus, FunnelPlus, Search, RefreshCcw, LoaderCircle, RotateCcw, EllipsisVertical } from 'lucide-angular';
import { HttpClientModule } from '@angular/common/http';
import { PayableService } from './features/financial/services/payable.service';
import { PayableMockService } from './features/financial/services/payable-mock.service';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt);

const services: (Provider | EnvironmentProviders)[] = [{
  provide: PayableService, useClass: PayableMockService,
}];

const lucideIcons = { EllipsisVertical, LoaderCircle, RotateCcw, RefreshCcw, Search, Plus, Funnel, FunnelPlus, Home, MessagesSquare, MessageSquareMore, MessageCircleMore, Origami, Calendar, CalendarRange, Settings, Bell, HelpCircle, BanknoteArrowDown, BanknoteArrowUp, Clock, ClockFading, SquareKanban, PiggyBank, HandCoins, ClipboardList, ClipboardPenLine, FolderOpen, LayoutDashboard, ChevronLeft, ChevronRight, Pin, PinOff };

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    importProvidersFrom(HttpClientModule),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    importProvidersFrom(LucideAngularModule.pick(lucideIcons)),
    ...services,
  ],
};
