import { computed, Directive, inject, input, OnInit, signal } from '@angular/core';
import { PllFacade, PllPaginatedResponse, PllQueryFacade, PllRecord, PllRecordId } from '@pollaris';
import { PllFormSchema } from '@pollaris/forms';
import { Observable, switchMap, tap } from 'rxjs';
import { DialogFacade, Inputkeys } from '../facades/dialog.facade';
import { HlmDataTableActionFc, HlmDataTableColumn, HlmDataTableSelectionActionFc } from '../libs/ui/ui-table-helm/src/lib/hlm-data-table/hlm-data-table.component';
import { BaseFormComponentDirective, event, EventObs } from './base-form-component.directive';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';
import { AuthFacade } from '../../features/auth/facades/auth.facade';
import { errorHandler } from '../operators/error-handler.operator';

@Directive()
export abstract class BaseRecordListingComponentDirective<TRecordQueryModel extends PllRecordId, TRecordQueryParams extends PllRecord, TComponent extends BaseFormComponentDirective<any> = BaseFormComponentDirective<any>> implements OnInit {  
  public readonly userClass = input<ClassValue>("", { alias: "class" });
	protected readonly _computedClass = computed(() =>
		hlm("", this.userClass()),
	);

  isDialog = input<boolean>(false);
  offsetHeight = input<number>(0);
  
  abstract facade: PllFacade<any>;
  abstract queryFacade: PllQueryFacade<TRecordQueryModel, TRecordQueryParams>;

  dialogFacade = inject(DialogFacade);
  authFacade = inject(AuthFacade);
  
  authData = this.authFacade.state.userData;
  isLoggedIn = this.authFacade.state.isLoggedIn;

  filter: PllFormSchema<TRecordQueryParams>;
  values = computed(() => this.queryFacade.data()?.data || []);
  pagination = computed(() => this.queryFacade.data().pagination);

  loading = signal<boolean>(false);
  processing = signal<boolean>(false);

  columns = signal<HlmDataTableColumn[]>([]);
  actionFn: HlmDataTableActionFc<TRecordQueryModel>;
  selectionActionFn: HlmDataTableSelectionActionFc<TRecordQueryModel>;

  $evNgOnInit: EventObs<void> = event();
  $evUpdateUI: EventObs<PllPaginatedResponse<TRecordQueryModel>> = event();
  $evInitFilter: EventObs<void> = event();

  ngOnInit() {
    this._configureFilterSchema();
    this.$evNgOnInit().pipe(
      switchMap(() => this.$evInitFilter()),
      switchMap(() => this.$updateUI()),
      errorHandler(),
    ).subscribe();
  };

  private _configureFilterSchema() {
    this.filter = new PllFormSchema(this.queryFacade.filterSchema);
  };

  handleApplyFilters() {
    this.updateUI();
  };

  handleClearFilters() {
    this.$evInitFilter().pipe(tap(() => this._configureFilterSchema())).subscribe();
  };

  updateUI() {
    this.$updateUI().subscribe({
      error: error => console.error(error),
    });
  };

  $updateUI(): Observable<PllPaginatedResponse<TRecordQueryModel>> {
    this.loading.set(true);
    return this.filter.handleSubmit().pipe(
      tap(response => console.log("FILTERS", response)),
      switchMap(params => this.queryFacade.useQuery(params)),
      tap(response => console.log("UPDATE-UI", response)),
      tap(() => this.loading.set(false)),
      switchMap(response => this.$evUpdateUI(response)),
    );
  };

  handleCreate(inputs: Inputkeys<BaseFormComponentDirective<any>> & Inputkeys<TComponent> = {}) {
    this.facade.openToCreate(inputs).subscribe(() => this.updateUI());
  };

  handleUpdate(rowData: TRecordQueryModel, inputs: Inputkeys<BaseFormComponentDirective<any>> & Inputkeys<TComponent> = {}) {
    this.facade.openToUpdate(rowData.id, inputs).subscribe(() => this.updateUI());
  };

  handleDelete(rowData: TRecordQueryModel) {
    this.facade.openToDelete(rowData.id).subscribe(() => this.updateUI());
  };

  handleDeleteMany(data: TRecordQueryModel[]) {
    this.facade.openToDeleteMany(data.map(record => record.id)).subscribe(() => this.updateUI());
  };
};