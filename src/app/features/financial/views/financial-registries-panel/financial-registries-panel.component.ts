import { Component } from '@angular/core';
import { GlobalModule } from '../../../../core/modules/global-module.module';
import { SecrecyListingComponent } from '../secrecy/secrecy-listing/secrecy-listing.component';
import { PlanOfAccountListingComponent } from '../plan-of-account/plan-of-account-listing/plan-of-account-listing.component';
import { CenterOfCostListingComponent } from '../center-of-cost/center-of-cost-listing/center-of-cost-listing.component';

@Component({
  standalone: true,
  selector: 'app-financial-registries-panel',
  imports: [GlobalModule, SecrecyListingComponent, PlanOfAccountListingComponent, CenterOfCostListingComponent],
  templateUrl: './financial-registries-panel.component.html',
})
export class FinancialRegistriesPanelComponent {};