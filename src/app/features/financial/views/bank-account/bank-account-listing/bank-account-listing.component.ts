import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { BankAccount } from '../../../models/bank-account.model';
import { GetAllBankAccountByFilterParams } from '../../../services/bank-account.service';
import { BankAccountFacade } from '../../../facades/bank-account.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';

@Component({
  standalone: true,
  selector: 'app-bank-account-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './bank-account-listing.component.html',
})
export class BankAccountListingComponent extends BaseRecordListingComponentDirective<BankAccount, GetAllBankAccountByFilterParams> {
  override facade = inject(BankAccountFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Ativos", value: "ACTIVE" },
    { label: "Inativos", value: "INACTIVE" },
  ];
};