import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { HlmButtonModule } from '../../common/libs/ui/ui-button-helm/src';
import { HlmTableModule } from '../../common/libs/ui/ui-table-helm/src';
import { HlmPopoverModule } from '../../common/libs/ui/ui-popover-helm/src';
import { BrnPopoverModule } from '@spartan-ng/brain/popover';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HlmPaginationModule } from '../../common/libs/ui/ui-pagination-helm/src';
import { HlmSelectModule } from '../../common/libs/ui/ui-select-helm/src';
import { HlmTemplateDirective } from '../../common/directives/hlm-template.directive';
import { HlmDatePickerModule } from '../../common/libs/ui/ui-datepicker-helm/src';
import { HlmCalendarModule } from '../../common/libs/ui/ui-calendar-helm/src';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { HlmBadgeModule } from '../../common/libs/ui/ui-badge-helm/src';
import { HlmInputModule } from '../../common/libs/ui/ui-input-helm/src';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmCheckboxModule } from '../../common/libs/ui/ui-checkbox-helm/src';
import { HlmTabsModule } from '../../common/libs/ui/ui-tabs-helm/src';
import { HlmMenuModule } from '../../common/libs/ui/ui-menu-helm/src';
import { NgxCurrencyDirective } from "ngx-currency";
import { CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter, CalendarModule, CalendarUtils } from 'angular-calendar';
import { HlmPinComponent } from '../../common/components/pin.component';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';

export const GeneralImports = [
	NgxMaskDirective, 
	NgxMaskPipe, 
	HlmTemplateDirective, 
	FormsModule, 
	ReactiveFormsModule, 
	LucideAngularModule, 
	NgIf, 
	NgFor, 
	NgForOf,
	NgStyle,
	NgClass,
	DatePipe,
	CurrencyPipe,
	NgTemplateOutlet,
	NgxCurrencyDirective,
	CalendarModule
];

export const SpartanUIImports = [
	HlmMenuModule, 
	HlmTabsModule, 
	HlmCheckboxModule, 
	BrnSelectModule, 
	HlmBadgeModule, 
	HlmDatePickerModule, 
	HlmCalendarModule, 
	HlmButtonModule,
	HlmInputModule,
	HlmTableModule,
	HlmPopoverModule,
	BrnPopoverModule,
	HlmPaginationModule,
	HlmSelectModule,
	HlmPinComponent,
	...HlmRadioGroupImports,
	HlmToasterComponent,
];

@NgModule({
	imports: [ 
		...GeneralImports, 
		...SpartanUIImports,
	],
	exports: [ ...GeneralImports, ...SpartanUIImports ],
  providers: [CalendarUtils, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter],
})
export class GlobalModule {}