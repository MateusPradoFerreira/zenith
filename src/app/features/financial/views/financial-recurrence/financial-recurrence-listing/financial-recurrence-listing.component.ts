import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { FinancialRecurrenceFacade, FinancialRecurrenceQueryFacade, FinancialRecurrenceUQP, FinancialRecurrenceUQR } from '../../../facades/financial-recurrence.facade';
import { HlmDataTableActionFc, HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { FinancialRecurrenceFormComponent } from '../financial-recurrence-form/financial-recurrence-form.component';
import { SelectItem } from '../../../../../common/types/select-item.type';
import { PllID } from '@pollaris';
import { RecurrenceFacade } from '../../../../schedule/facades/recurrence.facade';
import { errorHandler } from '../../../../../common/operators/error-handler.operator';
import { toast } from 'ngx-sonner';

@Component({
  standalone: true,
  selector: 'app-financial-recurrence-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './financial-recurrence-listing.component.html',
})
export class FinancialRecurrenceListingComponent extends BaseRecordListingComponentDirective<FinancialRecurrenceUQR, FinancialRecurrenceUQP, FinancialRecurrenceFormComponent> {
  override facade = inject(FinancialRecurrenceFacade);
  override queryFacade = inject(FinancialRecurrenceQueryFacade);

  private recurrenceFacade = inject(RecurrenceFacade);

  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
    { header: "Tipo", class: "w-42" },
    { header: "Valor", class: "w-36 justify-end" },
  ]);

  override actionFn: HlmDataTableActionFc<FinancialRecurrenceUQR> = (data: FinancialRecurrenceUQR) => ([
    { icon: "calendar-sync", label: "Gerar registros", command: () => this.handleGenerate(data.recurrenceId) },
    { separator: true },
    { icon: "trash-2", label: "Excluir", command: () => this.handleDelete(data) },
  ]);

  statusOptions: SelectItem<"ALL" | "ACTIVE" | "INACTIVE">[] = [
    { label: "Todos", value: "ALL" },
    { label: "Ativo", value: "ACTIVE" },
    { label: "Inativo", value: "INACTIVE" },
  ];

  handleGenerate(recurrenceId: PllID) {
    this.processing.set(false),
    this.recurrenceFacade.handleGenerate(recurrenceId).pipe(errorHandler()).subscribe({
      next: () => {
        toast.success("SUCESSO!", { description: "Registros Gerados com Sucesso!" });
        this.updateUI()
        this.processing.set(false);
      },
      error: () => {
        this.processing.set(false);
      },
    });
  };
};