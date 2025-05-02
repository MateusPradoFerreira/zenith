
import { Component, inject, Type } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseListComponentDirective } from '../../../../../common/directives/base-list-component.directive';
import { GetAllPlanOfAccountByFilterParams } from '../../../services/plan-of-account.service';
import { PlanOfAccountFacade } from '../../../facades/plan-of-account.facade';
import { FormSchemaConfig } from '../../../../../core/types/form-schema.type';
import { HlmDataTableColumn } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table.component';
import { PlanOfAccountFormComponent } from '../plan-of-account-form/plan-of-account-form.component';
import { PlanOfAccount } from '../../../models/plan-of-account.model';
import { DialogWidth } from '../../../../../common/facades/dialog.facade';

@Component({
  selector: 'app-plan-of-account-list',
  imports: [GlobalModule],
  templateUrl: './plan-of-account-list.component.html',
})
export class PlanOfAccountListComponent extends BaseListComponentDirective<PlanOfAccount, GetAllPlanOfAccountByFilterParams> {
  override facade: PlanOfAccountFacade = inject(PlanOfAccountFacade);
  override component: Type<PlanOfAccountFormComponent> = PlanOfAccountFormComponent;
  override dialogHeader: string = "Plano de Conta";
  override dialogWidth: DialogWidth = "65";

  override filterSchema: FormSchemaConfig<GetAllPlanOfAccountByFilterParams> = {
    status: { defaultValue: "ACTIVE" },
  };

  override columns: HlmDataTableColumn[] = [
    { header: "Nome", class: "flex-1" },
    { header: "", class: "w-16" },
  ];
};
