
import { Component, inject, Type } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseListComponentDirective } from '../../../../../common/directives/base-list-component.directive';
import { GetAllPayableByFilterParams } from '../../../services/payable.service';
import { PayableFacade } from '../../../facades/payable.facade';
import { FormSchemaConfig } from '../../../../../core/types/form-schema.type';
import { HlmDataTableColumn } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table.component';
import { CurrencyPipe } from '@angular/common';
import { PayableFormComponent } from '../payable-form/payable-form.component';
import { Payable } from '../../../models/payable.model';

@Component({
  selector: 'app-payable-list',
  imports: [GlobalModule, CurrencyPipe],
  templateUrl: './payable-list.component.html',
})
export class PayableListComponent extends BaseListComponentDirective<Payable, GetAllPayableByFilterParams> {
  override facade: PayableFacade = inject(PayableFacade);
  override component: Type<PayableFormComponent> = PayableFormComponent;
  override dialogHeader: string = "Despesa";

  override filterSchema: FormSchemaConfig<GetAllPayableByFilterParams> = {
    startsAt: { defaultValue: new Date() },
    endsAt: { defaultValue: new Date() },
  };

  override columns: HlmDataTableColumn[] = [
    { header: "Name", class: "flex-1" },
    { header: "Method", class: "w-60" },
    { header: "Status", class: "w-60" },
    { header: "Amount", class: "w-60 justify-end" },
    { header: "", class: "w-16" },
  ];

};
