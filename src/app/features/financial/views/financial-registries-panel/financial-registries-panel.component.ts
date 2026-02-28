import { Component, computed, input } from '@angular/core';
import { GlobalModule } from '../../../../core/modules/global-module.module';
import { SecrecyListingComponent } from '../secrecy/secrecy-listing/secrecy-listing.component';
import { CenterOfCostListingComponent } from '../center-of-cost/center-of-cost-listing/center-of-cost-listing.component';
import { PlanOfAccountListingComponent } from '../plan-of-account/plan-of-account-listing/plan-of-account-listing.component';
import { BankAccountListingComponent } from '../bank-account/bank-account-listing/bank-account-listing.component';
import { ScheduleCategoryListingComponent } from '../../../schedule/views/schedule-category/schedule-category-listing/schedule-category-listing.component';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/helm/utils';

@Component({
  standalone: true,
  selector: 'app-financial-registries-panel',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule, SecrecyListingComponent, CenterOfCostListingComponent, PlanOfAccountListingComponent, BankAccountListingComponent, ScheduleCategoryListingComponent],
  templateUrl: './financial-registries-panel.component.html',
})
export class FinancialRegistriesPanelComponent {
  public readonly userClass = input<ClassValue>("", { alias: "class" });
	protected readonly _computedClass = computed(() => hlm("block overflow-hidden grid grid-rows-1 grid-cols-1", this.userClass()));
};