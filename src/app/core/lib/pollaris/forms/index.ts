import { FormControl, FormGroup, UntypedFormGroup, ValidatorFn } from "@angular/forms";
import { map, Observable, tap } from "rxjs";
import { PllDataTransformError, PllDataTransformErrorContext, PllDataTransformHandle, PllDataTransformer } from "../transformers";
import { PllRecord } from "..";

export type PllFormGrCtr<TFormModel> = { [Key in keyof TFormModel]: FormControl<TFormModel[Key]> };
export type PllFormGroup<TFormModel> = FormGroup<PllFormGrCtr<TFormModel>>;

export type PllFormSchemaValidator = ValidatorFn;
export type PllFormControlValidator = ValidatorFn;

export abstract class PllFormStarter<TCtrValue, TFormValue> extends PllDataTransformer<TCtrValue, TFormValue> {};
export abstract class PllFormRefiner<TCtrValue, TFormValue> extends PllDataTransformer<TCtrValue, TFormValue> {};

export type PllFormControl<TCtrValue, TFormValue> = {
  value: TCtrValue;
  disabled?: boolean;
  validators?: PllFormControlValidator[];
  starters?: PllFormStarter<TCtrValue, TFormValue>[];
  refiners?: PllFormRefiner<TCtrValue, TFormValue>[];
  onChange?: (value: TCtrValue, form: PllFormGroup<TFormValue>) => void;
};

export type PllFormSchemaConfig<TSchemaModel extends PllRecord> = {
  fields: { [Key in keyof TSchemaModel]: PllFormControl<TSchemaModel[Key], TSchemaModel> };
  validators?: PllFormSchemaValidator[];
};

export class PllFormSchema<TSchemaModel extends PllRecord> {
  form: PllFormGroup<TSchemaModel>;

  constructor (
    private _config: PllFormSchemaConfig<TSchemaModel>,
  ) {
    this._configure();
  };

  get value() { return this.form.getRawValue() as TSchemaModel };
  get controls() { return this.form.controls };
  get addValidators() { return this.form.addValidators };
  get clearValidators() { return this.form.clearValidators };
  get invalid() { return this.form.invalid };

  private _configure() {
    const form: UntypedFormGroup = new FormGroup({});
    Object.entries<PllFormControl<any, any>>(this._config.fields).forEach(([field, { value, disabled, validators, onChange }]) => {
      form.addControl(field, new FormControl({ value, disabled }, { validators }));
      if(onChange) form.controls[field].valueChanges.subscribe(data => onChange(data, form));
    });
    if(this._config.validators) form.setValidators(this._config.validators);
    this.form = form;
  };

  setValue(data: TSchemaModel): Observable<TSchemaModel> {
    return this.patchValue(data);
  };

  patchValue(data: Partial<TSchemaModel>): Observable<TSchemaModel> {
    const startCtx = this._getControlContext<"starters">("starters");
    return PllDataTransformHandle.transformContext<TSchemaModel>({ ...this.form.getRawValue(), ...data } as TSchemaModel, startCtx).pipe(
      tap(({ data, errors }) => {
        if(errors) throw new PllFormStarterError(errors);
        this.form.patchValue(data);
      }),
      map(response => response.data),
    );
  };

  refine(): Observable<TSchemaModel> {
    const formValue: TSchemaModel = Object.assign({}, this.form.getRawValue() as TSchemaModel);
    const refineCtx = this._getControlContext<"refiners">("refiners");
    return PllDataTransformHandle.transformContext<TSchemaModel>(formValue, refineCtx).pipe(
      tap(({ errors }) => {
        if(errors) throw new PllFormRefinerError(errors);
      }),
      map(response => response.data),
    );
  };

  handleSubmit() {
    return this.refine().pipe(tap(() => {
      if(this.form.invalid) throw new Error("Inválid Form!");
    }));
  };

  private _getControlContext<Key extends keyof PllFormControl<any, TSchemaModel>>(key: Key): { [Tkey in keyof TSchemaModel]: PllFormControl<TSchemaModel[Tkey], TSchemaModel>[Key] } {
    const context: any = {};
    Object.entries<PllFormControl<any, any>>(this._config.fields).forEach(([field, config]) => {
      if(config[key] && (Array.isArray(config[key])? config[key].length : true)) context[field] = config[key];
    });
    return context;
  };

};

export class PllFormStarterError<TFormValue> extends PllDataTransformError<TFormValue> {};
export class PllFormRefinerError<TFormValue> extends PllDataTransformError<TFormValue> {};