import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { SecrecyFacade, SecrecyQueryFacade, SecrecyUQP, SecrecyUQR } from '../../../facades/secrecy.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { SecrecyFormComponent } from '../secrecy-form/secrecy-form.component';
import { SelectItem } from '../../../../../common/types/select-item.type';

@Component({
  standalone: true,
  selector: 'app-secrecy-listing',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './secrecy-listing.component.html',
})
export class SecrecyListingComponent extends BaseRecordListingComponentDirective<SecrecyUQR, SecrecyUQP, SecrecyFormComponent> {
  override facade = inject(SecrecyFacade);
  override queryFacade = inject(SecrecyQueryFacade);
  
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions: SelectItem<"ALL" | "ACTIVE" | "INACTIVE">[] = [
    { label: "Todos", value: "ALL" },
    { label: "Ativo", value: "ACTIVE" },
    { label: "Inativo", value: "INACTIVE" },
  ];
};