import { FormControl, FormGroup, Validators } from "@angular/forms";

export type Object = Record<any, any>;
export type ObjectId = { id: string };
export type Mapper<TModel> = { [K in keyof TModel]: any };
export type PMapper<TModel> = Partial<Mapper<TModel>>;
export type Union<Ta, Tb> = Ta & Tb;

export type Initializer<Ta, Tb> = (value: Ta) => Tb | Promise<Tb>;
export type Refiner<Ta, Tb, TFormValue> = { refineFn: RefineFn<Ta, Tb, TFormValue>, message?: string } | RefineFn<Ta, Tb, TFormValue>;
export type RefineFn<Ta, Tb, TFormValue> = (value: Ta, formValue: TFormValue) => Tb | Promise<Tb>;

export type FormSchemaConfig<TSchema extends Object, TMapper extends PMapper<TSchema> = TSchema> = { [Key in keyof Union<TSchema, TMapper>]: FormSchemaField<Union<TSchema, TMapper>, TSchema[Key], TMapper[Key]> };
export type FormSchemaField<TFormValue, Ta, Tb= Ta> = Ta extends Tb? {
  defaultValue: Ta,
  validators?: Validators[],
  initializers?: Initializer<Ta, Tb>[],
  refiners?: Refiner<Tb, Ta, TFormValue>[],
} : {
  defaultValue: Tb,
  validators?: Validators[],
  initializers: Initializer<Ta, Tb>[],
  refiners: Refiner<Tb, Ta, TFormValue>[],
};

export type FormSchemaFieldError = {
  error: any,
  message: string,
};

export type FormSchemaError<TSchema> = { [Key in keyof TSchema]: FormSchemaFieldError };

export class FormSchema<TSchema extends Object, TMapper extends PMapper<TSchema> = TSchema> {
  private _schema: FormSchemaConfig<TSchema, TMapper>;
  fb: FormGroup<{[Key in keyof Union<TSchema, TMapper>]: FormControl<Union<TSchema, TMapper>[Key]>}>;

  get value() { return this.fb.value };
  get valid() { return this.fb.valid };
  get controls() { return this.fb.controls };

  constructor(config: FormSchemaConfig<TSchema, TMapper>) {
    this._schema = config;
    this._configureForm();
  };

  private _configureForm() {
    const fb: any = new FormGroup({});
    Object.entries(this._schema).forEach(([field, { defaultValue, validators }]) => {
      fb.addControl(field, new FormControl(defaultValue, validators || []));
    });
    this.fb = fb;
  };

  async populateForm(data: Partial<TSchema>) {
    const fields = Object.entries(data);
    for (let fieldEntry of fields) {
      const fieldKey: string = fieldEntry[0];
      const fieldValue: any = fieldEntry[1];
      const fieldConfig: FormSchemaField<any, any, any> = this._schema[fieldKey] || null;
      if(fieldConfig) await this._populateField(fieldKey, fieldValue, fieldConfig);
    };
  };

  private async _populateField(fieldKey: string, fieldValue: any, fieldConfig: FormSchemaField<any, any, any>) {
    if(this.fb.controls[fieldKey]) {
      if(fieldConfig.initializers) {
        for(let initializer of fieldConfig.initializers) {
          try {
            fieldValue = await initializer(fieldValue);
          } catch (error) {
            console.error(`Error on initialize "${fieldKey}" field:`, error);
          };
        };
      };
      this.fb.controls[fieldKey].setValue(fieldValue);
    } else {
      console.warn(`The "${fieldKey}" field doesn't exist in the context of the form`);
    };
  };

  async formatRegistry(data: Union<TSchema, TMapper> = this.fb.value as Union<TSchema, TMapper>): Promise<[TSchema, errors: FormSchemaError<TSchema> | null]> {
    const registry: TSchema = Object.assign({}, data);
    const fields = Object.entries(this._schema);
    const errors: any = {};
    for (let fieldEntry of fields) {
      const fieldKey: keyof TSchema = fieldEntry[0];
      const fieldConfig: FormSchemaField<any, any, any> = fieldEntry[1];
      const [refinedValue, fieldErrors] = await this._useRefiners(fieldKey, registry[fieldKey], registry, fieldConfig);
      registry[fieldKey] = refinedValue;
      if(fieldErrors.length) errors[fieldKey] = fieldErrors;
    };
    return [registry, Object.keys(errors).length? errors : null];
  };

  private async _useRefiners(fieldKey: string, fieldValue: any, formValue: any, fieldConfig: FormSchemaField<any, any, any>): Promise<[any, FormSchemaFieldError[]]> {
    var errors: FormSchemaFieldError[] = [];
    if(fieldConfig.refiners) {
      for(let refiner of fieldConfig.refiners) {
        try {
          if(typeof refiner === "function") {
            fieldValue = await refiner(fieldValue, formValue);
          } else {
            fieldValue = await refiner.refineFn(fieldValue, formValue);
          };
        } catch (error: any) {
          const message = typeof refiner === "function"? error?.error?.message || error?.message || error : refiner?.message || error?.error?.message || error?.message || error;
          errors.push({ error, message });
        };
      };
    };
    return [fieldValue, errors];
  };

};