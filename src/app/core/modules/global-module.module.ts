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
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { HlmBadgeModule } from '../../common/libs/ui/ui-badge-helm/src';
import { HlmInputModule } from '../../common/libs/ui/ui-input-helm/src';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmCheckboxModule } from '../../common/libs/ui/ui-checkbox-helm/src';
import { HlmTabsModule } from '../../common/libs/ui/ui-tabs-helm/src';
import { HlmMenuModule } from '../../common/libs/ui/ui-menu-helm/src';

const generalModules = [
	NgxMaskDirective, 
	NgxMaskPipe, 
	HlmTemplateDirective, 
	FormsModule, 
	ReactiveFormsModule, 
	LucideAngularModule, 
	NgIf, 
	NgFor, 
	NgForOf,
];

const spartanUIModules = [
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
	HlmSelectModule
];

@NgModule({
	imports: [ ...generalModules, ...spartanUIModules ],
	exports: [ ...generalModules, ...spartanUIModules ],
})
export class GlobalModule {}