
import { Component, inject, Type } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseListComponentDirective } from '../../../../../common/directives/base-list-component.directive';
import { GetAllReceivableByFilterParams } from '../../../services/receivable.service';
import { ReceivableFacade } from '../../../facades/receivable.facade';
import { FormSchemaConfig } from '../../../../../core/types/form-schema.type';
import { HlmDataTableColumn } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ReceivableFormComponent } from '../receivable-form/receivable-form.component';
import { Receivable } from '../../../models/receivable.model';

@Component({
  selector: 'app-receivable-list',
  imports: [GlobalModule, CurrencyPipe, DatePipe],
  templateUrl: './receivable-list.component.html',
})
export class ReceivableListComponent extends BaseListComponentDirective<Receivable, GetAllReceivableByFilterParams> {
  override facade: ReceivableFacade = inject(ReceivableFacade);
  override component: Type<ReceivableFormComponent> = ReceivableFormComponent;
  override dialogHeader: string = "Recebível";

  override filterSchema: FormSchemaConfig<GetAllReceivableByFilterParams> = {
    startsAt: { defaultValue: new Date() },
    endsAt: { defaultValue: new Date() },
  };

  override columns: HlmDataTableColumn[] = [
    { header: "N° Doc", class: "w-40" },
    { header: "Nome", class: "flex-1" },
    { header: "Emissão", class: "w-40" },
    { header: "Vencimento", class: "w-40" },
    { header: "Status", class: "w-40" },
    { header: "Valor", class: "w-40 justify-end" },
    { header: "", class: "w-16" },
  ];

};
