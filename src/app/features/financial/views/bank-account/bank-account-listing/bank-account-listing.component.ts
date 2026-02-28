import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { BankAccountFacade, BankAccountQueryFacade, BankAccountUQP, BankAccountUQR } from '../../../facades/bank-account.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { BankAccountFormComponent } from '../bank-account-form/bank-account-form.component';
import { SelectItem } from '../../../../../common/types/select-item.type';

@Component({
  standalone: true,
  selector: 'app-bank-account-listing',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './bank-account-listing.component.html',
})
export class BankAccountListingComponent extends BaseRecordListingComponentDirective<BankAccountUQR, BankAccountUQP, BankAccountFormComponent> {
  override facade = inject(BankAccountFacade);
  override queryFacade = inject(BankAccountQueryFacade);
  
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions: SelectItem<"ALL" | "ACTIVE" | "INACTIVE">[] = [
    { label: "Todos", value: "ALL" },
    { label: "Ativo", value: "ACTIVE" },
    { label: "Inativo", value: "INACTIVE" },
  ];
};