import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { Payable } from '../../../models/payable.model';
import { PayableFacade } from '../../../facades/payable.facade';
import { PlanOfAccount } from '../../../models/plan-of-account.model';
import { PlanOfAccountService } from '../../../services/plan-of-account.service';
import { CenterOfCostService } from '../../../services/center-of-cost.service';
import { CenterOfCost } from '../../../models/center-of-cost.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-payable-form',
  imports: [GlobalModule],
  templateUrl: './payable-form.component.html',
})
export class PayableFormComponent extends BaseFormComponentDirective<Payable> {
  override facade: PayableFacade = inject(PayableFacade);

  centerOfCostService: CenterOfCostService = inject(CenterOfCostService);
  planOfAccountService: PlanOfAccountService = inject(PlanOfAccountService);

  centerOfCostOptions: CenterOfCost[] = [];
  planOnAccountOptions: PlanOfAccount[] = [];

  override async evOnInit(): Promise<void> {
    await this.getCenterOfCostOptions();
    await this.getPlanOfAccountOptions();
  };

  override async evOnPopulateToInsertRegistry(): Promise<void> {
    this.form.controls.secrecyId.setValue(this.centerOfCostOptions[0].id);
    this.form.controls.centerOfCostId.setValue(this.centerOfCostOptions[0].id);
    this.form.controls.planOfAccountId.setValue(this.planOnAccountOptions[0].id);
  };

  async getCenterOfCostOptions() {
    await lastValueFrom(this.centerOfCostService.getAllByFilter({ status: "ACTIVE" })).then(res => {
      this.centerOfCostOptions = res;
    }, error => console.error(error));
  };

  async getPlanOfAccountOptions() {
    await lastValueFrom(this.planOfAccountService.getAllByFilter({ status: "ACTIVE" })).then(res => {
      this.planOnAccountOptions = res;
    }, error => console.error(error));
  };

};