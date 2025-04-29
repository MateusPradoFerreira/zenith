import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { HlmInputDirective } from '../../common/libs/ui/ui-input-helm/src';
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


const generalModules = [HlmTemplateDirective, FormsModule, ReactiveFormsModule, LucideAngularModule];

const spartanUIModules = [HlmDatePickerModule, HlmCalendarModule, HlmButtonModule, HlmInputDirective, HlmTableModule, HlmPopoverModule, BrnPopoverModule, HlmPaginationModule, HlmSelectModule];

@NgModule({
	imports: [ ...generalModules, ...spartanUIModules ],
	exports: [ ...generalModules, ...spartanUIModules ],
})
export class GlobalModule {}