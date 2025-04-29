import { Directive, inject, Input, OnInit } from '@angular/core';
import { BaseFacade } from '../../core/base/base-facade';
import { FormSchema, FormSchemaError, ObjectId, PMapper } from '../../core/types/form-schema.type';
import { lastValueFrom } from 'rxjs';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';

@Directive()
export abstract class BaseFormComponentDirective<TModel extends ObjectId, TMapper extends PMapper<TModel> = TModel> implements OnInit {  
  @Input() id: string;

  abstract facade: BaseFacade<TModel, TMapper>;

  form: FormSchema<TModel, TMapper>;

  originalRegistry: TModel;
  registry: TModel;

  loading: boolean = false;
  processing: boolean = false;

  // events
  async evOnInit(): Promise<void> {};
  async evOnUpdateUI(): Promise<void> {};
  async evOnSetDefaultData(): Promise<void> {};
  async evOnPopulateForm(): Promise<void> {};
  async evOnInsertRegistry(res: TModel): Promise<void> {};
  async evOnUpdateRegistry(res: TModel): Promise<void> {};
  async evOnSubmitPrev(): Promise<void> {};
  async evOnSubmitNext(): Promise<void> {};

  private readonly _dialogRef = inject<BrnDialogRef<any>>(BrnDialogRef);

  async ngOnInit() {
    this._configureForm();
    await this.evOnInit();
    await this.updateUI();
  };

  async updateUI() {
    this.loading = true;
    
    if(!this.id) {
      await this.populateForm();
      this.loading = false;
      return;
    };

    await lastValueFrom(this.facade.get(this.id)).then(async res => {
      console.log("UPDATE-UI", res);
      this.originalRegistry = res;
      this.registry = res;
      await this.populateForm(res);
      await this.evOnUpdateUI();
      this.loading = false;
    }).catch(async error => {
      console.error(error);
      await this.populateForm();
      this.loading = false;
    });
  };

  private _configureForm() {
    this.form = new FormSchema(this.facade.formSchema);
  };

  async populateForm(data?: Partial<TModel>) {
    if(!data) {
      this._configureForm();
      await this.evOnSetDefaultData();
      return;
    };

    this.form.populateForm(data);
    await this.evOnPopulateForm();
  };

  private async _formatRegistry(): Promise<TModel> {
    const [registry, errors] = await this.form.formatRegistry();
    return new Promise((resolve, reject) => {
      if(errors) { reject(errors); return };
      this.registry = registry;
      resolve(registry);
    });
  };

  async onSubmit() {
    await this._formatRegistry().then(async () => {
      await this.evOnSubmitPrev();
      !this.id? await this.insertRegistry() : await this.updateRegistry();
      await this.evOnSubmitNext();
    }).catch((error: FormSchemaError<TModel>) => {
      console.error(error);
    });
  };

  async insertRegistry() {
    console.log("INSERT-REGISTRY", this.registry);
  };

  async updateRegistry() {
    console.log("UPDATE-REGISTRY", this.registry);
  };

  back() {
    this._dialogRef.close();
  };

}