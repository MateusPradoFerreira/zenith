import { Component } from '@angular/core';
import { GlobalModule } from '../../../../core/modules/global-module.module';
import { ScheduleCategoryListingComponent } from '../schedule-category/schedule-category-listing/schedule-category-listing.component';

@Component({
  standalone: true,
  selector: 'app-schedule-registries-panel',
  imports: [GlobalModule, ScheduleCategoryListingComponent],
  templateUrl: './schedule-registries-panel.component.html',
})
export class ScheduleRegistriesPanelComponent {};