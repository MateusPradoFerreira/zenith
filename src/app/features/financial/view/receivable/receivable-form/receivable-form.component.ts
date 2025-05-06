import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { Receivable } from '../../../models/receivable.model';
import { ReceivableFacade } from '../../../facades/receivable.facade';
import { PlanOfAccount } from '../../../models/plan-of-account.model';
import { PlanOfAccountService } from '../../../services/plan-of-account.service';
import { CenterOfCostService } from '../../../services/center-of-cost.service';
import { CenterOfCost } from '../../../models/center-of-cost.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-receivable-form',
  imports: [GlobalModule],
  templateUrl: './receivable-form.component.html',
})
export class ReceivableFormComponent extends BaseFormComponentDirective<Receivable> {
  override facade: ReceivableFacade = inject(ReceivableFacade);

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