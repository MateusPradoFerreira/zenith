import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../core/modules/global-module.module';
import { PlanOfAccountListComponent } from '../plan-of-account/plan-of-account-list/plan-of-account-list.component';
import { CenterOfCostListComponent } from '../center-of-cost/center-of-cost-list/center-of-cost-list.component';
import { SecrecyListComponent } from '../secrecy/secrecy-list/secrecy-list.component';

@Component({
  selector: 'app-financial-registries',
  imports: [GlobalModule, PlanOfAccountListComponent, CenterOfCostListComponent, SecrecyListComponent],
  templateUrl: './financial-registries.component.html',
})
export class FinancialRegistriesComponent {};