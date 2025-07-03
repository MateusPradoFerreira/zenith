import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseRecordListingComponentDirective } from '../../../../../common/directives/base-listing-component.directive';
import { Secrecy } from '../../../models/secrecy.model';
import { GetAllSecrecyByFilterParams } from '../../../services/secrecy.service';
import { SecrecyFacade } from '../../../facades/secrecy.facade';
import { HlmDataTableColumn, HlmDataTableComponent } from '../../../../../common/libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';

@Component({
  standalone: true,
  selector: 'app-secrecy-listing',
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: './secrecy-listing.component.html',
})
export class SecrecyListingComponent extends BaseRecordListingComponentDirective<Secrecy, GetAllSecrecyByFilterParams> {
  override facade = inject(SecrecyFacade);
  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Ativos", value: "ACTIVE" },
    { label: "Inativos", value: "INACTIVE" },
  ];
};