import { computed, Directive, inject, input, OnInit, signal, Signal } from '@angular/core';
import { PllFacade, PllPaginatedResponse, PllQueryFacade, PllRecord, PllRecordId } from '@pollaris';
import { PllFormSchema } from '@pollaris/forms';
import { Observable, of, switchMap, tap } from 'rxjs';
import { DialogFacade, Inputkeys } from '../facades/dialog.facade';
import { HlmDataTableActionFc, HlmDataTableColumn, HlmDataTableSelectionActionFc } from '../libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { event, EventObs } from './base-form-component.directive';
import { hlm } from '@spartan-ng/brain/core';
import { ClassValue } from 'clsx';

@Directive()
export abstract class BaseRecordListingComponentDirective<TRecordQueryModel extends PllRecordId, TRecordQueryParams extends PllRecord> implements OnInit {  
  public readonly userClass = input<ClassValue>("", { alias: "class" });
	protected readonly _computedClass = computed(() =>
		hlm("", this.userClass()),
	);

  showHeader = input<boolean>(true);
  offsetHeight = input<number>(0);
  isDialog = input<boolean>(false);
  
  abstract facade: PllQueryFacade<any, TRecordQueryModel, TRecordQueryParams>;

  dialogFacade = inject(DialogFacade);
  dialogInputs: Signal<Inputkeys<any>> = computed(() => ({}));

  filter: PllFormSchema<TRecordQueryParams>;
  values = computed(() => this.facade.data()?.data || []);
  pagination = computed(() => this.facade.data().pagination);

  loading = signal<boolean>(false);
  processing = signal<boolean>(false);

  columns = signal<HlmDataTableColumn[]>([]);
  actionFn: HlmDataTableActionFc<TRecordQueryModel>;
  selectionActionFn: HlmDataTableSelectionActionFc<TRecordQueryModel>;

  onNgOnInit: EventObs<void> = event();
  onUpdateUI: EventObs<PllPaginatedResponse<TRecordQueryModel>> = event();

  ngOnInit() {
    this.loading = this.facade.loading;
    this.processing = this.facade.facade.processing;
    this.configureFilter();
    this.onNgOnInit().pipe(
      switchMap(() => this.handleUpdateUI()),
    ).subscribe({
      error: error => console.error(error),
    });
  };

  configureFilter() {
    this.filter = new PllFormSchema(this.facade.filterSchema);
  };

  updateUI() {
    this.handleUpdateUI().subscribe({
      error: error => console.error(error),
    });
  };

  handleUpdateUI(): Observable<PllPaginatedResponse<TRecordQueryModel>> {
    return this.filter.handleSubmit().pipe(
      tap(response => console.log("FILTERS", response)),
      switchMap(params => this.facade.useQuery(params)),
      tap(response => console.log("UPDATE-UI", response)),
      switchMap(response => this.onUpdateUI(response)),
    );
  };

  handleCreate() {
    this.facade.facade.openToCreate(this.dialogInputs()).subscribe(() => this.updateUI());
  };

  handleUpdate(rowData: TRecordQueryModel) {
    this.facade.facade.openToUpdate(rowData.id, this.dialogInputs()).subscribe(() => this.updateUI());
  };

  handleDelete(rowData: TRecordQueryModel) {
    this.facade.facade.openToDelete(rowData.id).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
    });
  };

  handleDeleteMany(data: TRecordQueryModel[]) {
    this.facade.facade.openToDeleteMany(data.map(record => record.id)).subscribe({
      next: () => this.updateUI(),
      error: error => console.error(error),
    });
  };

};