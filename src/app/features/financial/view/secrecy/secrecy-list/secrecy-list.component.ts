import { Component, inject, Type } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseListComponentDirective } from '../../../../../common/directives/base-list-component.directive';
import { GetAllSecrecyByFilterParams } from '../../../services/secrecy.service';
import { SecrecyFacade } from '../../../facades/secrecy.facade';
import { FormSchemaConfig } from '../../../../../core/types/form-schema.type';
import { HlmDataTableActionFc, HlmDataTableColumn } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table.component';
import { SecrecyFormComponent } from '../secrecy-form/secrecy-form.component';
import { Secrecy } from '../../../models/secrecy.model';
import { DialogWidth } from '../../../../../common/facades/dialog.facade';

@Component({
  selector: 'app-secrecy-list',
  imports: [GlobalModule],
  templateUrl: './secrecy-list.component.html',
})
export class SecrecyListComponent extends BaseListComponentDirective<Secrecy, GetAllSecrecyByFilterParams> {
  override facade: SecrecyFacade = inject(SecrecyFacade);
  override component: Type<SecrecyFormComponent> = SecrecyFormComponent;
  override dialogHeader: string = "Título";
  override dialogWidth: DialogWidth = "65";

  override filterSchema: FormSchemaConfig<GetAllSecrecyByFilterParams> = {
    status: { defaultValue: "ACTIVE" },
  };

  override columns: HlmDataTableColumn[] = [
    { header: "Nome", class: "flex-1" },
  ];

  override actionFn: HlmDataTableActionFc<Secrecy> = (data: Secrecy) => ([
    { label: "Excluir", icon: "trash-2", command: () => this.delete(data), disabled: data.default },
  ]);
};
