import { Component, inject, Type } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseListComponentDirective } from '../../../../../common/directives/base-list-component.directive';
import { GetAllCenterOfCostByFilterParams } from '../../../services/center-of-cost.service';
import { CenterOfCostFacade } from '../../../facades/center-of-cost.facade';
import { FormSchemaConfig } from '../../../../../core/types/form-schema.type';
import { HlmDataTableActionFc, HlmDataTableColumn } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table.component';
import { CenterOfCostFormComponent } from '../center-of-cost-form/center-of-cost-form.component';
import { CenterOfCost } from '../../../models/center-of-cost.model';
import { DialogWidth } from '../../../../../common/facades/dialog.facade';

@Component({
  selector: 'app-center-of-cost-list',
  imports: [GlobalModule],
  templateUrl: './center-of-cost-list.component.html',
})
export class CenterOfCostListComponent extends BaseListComponentDirective<CenterOfCost, GetAllCenterOfCostByFilterParams> {
  override facade: CenterOfCostFacade = inject(CenterOfCostFacade);
  override component: Type<CenterOfCostFormComponent> = CenterOfCostFormComponent;
  override dialogHeader: string = "Centro de Custo";
  override dialogWidth: DialogWidth = "65";

  override filterSchema: FormSchemaConfig<GetAllCenterOfCostByFilterParams> = {
    status: { defaultValue: "ACTIVE" },
  };

  override columns: HlmDataTableColumn[] = [
    { header: "Nome", class: "flex-1" },
  ];

  override actionFn: HlmDataTableActionFc<CenterOfCost> = (data: CenterOfCost) => ([
    { label: "Excluir", icon: "trash-2", command: () => this.delete(data), disabled: data.default },
  ]);
};
