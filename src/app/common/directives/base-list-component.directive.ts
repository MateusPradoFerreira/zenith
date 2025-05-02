import { Directive, inject, Input, OnInit, signal, Type, WritableSignal } from '@angular/core';
import { BaseFacade, BaseFacadeList } from '../../core/base/base-facade';
import { FormSchema, FormSchemaConfig, FormSchemaError, ObjectId } from '../../core/types/form-schema.type';
import { lastValueFrom } from 'rxjs';
import { HlmDataTableColumn } from '../libs/ui/ui-table-helm/src/lib/hlm-data-table.component';
import { DialogFacade, DialogWidth } from '../facades/dialog.facade';
import { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/brain/core';

@Directive()
export abstract class BaseListComponentDirective<TModel extends ObjectId, Params extends Object = any> implements OnInit {  
  @Input() class: string = "";

  abstract facade: BaseFacade<any> & BaseFacadeList<TModel, Params>;

  hlm = hlm;

  // dialog config
  abstract component: Type<any>;
  abstract dialogHeader: string;
  dialogWidth: DialogWidth = "95";

  // filter and table config
  abstract filterSchema: FormSchemaConfig<Params>;
  abstract columns: HlmDataTableColumn[];

  filter: FormSchema<Params>;
  private _filterValue: Params;

  values: WritableSignal<TModel[]> = signal([]);

  loading: boolean = false;
  processing: boolean = false;

  // events
  async evOnInit(): Promise<void> {};
  async evOnUpdateUI(): Promise<void> {};
  async evOnFormatFilterParams(): Promise<void> {};

  public readonly dialogFacade: DialogFacade = inject(DialogFacade);

  async ngOnInit() {
    this._configureFilter();
    await this.evOnInit();
    await this.updateUI();
  };

  async updateUI() {
    this.loading = true;
    await this._formaFilterValue().then(async () => {
      await lastValueFrom(this.facade.getByAllFilters(this._filterValue)).then(async res => {
        console.log("UPDATE-UI", res);
        this.values.set(res);
        await this.evOnUpdateUI();
        this.loading = false;
      }).catch(error => console.error(error));
    }).catch((error: FormSchemaError<TModel>) => {
      console.error("FILTER-ERRORS", error);
      this.loading = false;
    });
  };

  // filter functions
  private _configureFilter() {
    this.filter = new FormSchema(this.filterSchema);
  };

  private async _formaFilterValue(): Promise<Params> {
    const [filterValue, errors] = await this.filter.formatRegistry();
    return new Promise(async (resolve, reject) => {
      if(errors) { reject(errors); return };
      this._filterValue = filterValue;
      console.log("FILTER-VALUE", this._filterValue);
      await this.evOnFormatFilterParams();
      resolve(filterValue);
    });
  };

  async clearFilter() {
    this._configureFilter();
    this.updateUI();
  };

  // selection function
  onSelect(rowData: TModel) {
    this.dialogFacade.open(this.component, { header: this.dialogHeader, width: this.dialogWidth, context: { id: rowData.id } }).closed$.subscribe(() => this.updateUI());
  };

  onCreate() {
    this.dialogFacade.open(this.component, { header: this.dialogHeader, width: this.dialogWidth }).closed$.subscribe(() => this.updateUI());
  };

}