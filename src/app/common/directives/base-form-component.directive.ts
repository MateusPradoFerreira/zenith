import { computed, Directive, input, model, OnInit, signal } from "@angular/core";
import { PllFacade, PllID, PllRecordId } from "../../core/lib/pollaris";
import { PllFormSchema } from "../../core/lib/pollaris/forms";
import { map, Observable, of, OperatorFunction, switchMap, tap } from "rxjs";
import { injectBrnDialogContext, injectBrnDialogCtx } from "@spartan-ng/brain/dialog";
import { ClassValue } from "clsx";
import { hlm } from "@spartan-ng/brain/core";

export type EventObs<T = void> = (data?: T) => Observable<any>;
export const event = <T = void>(...operators: OperatorFunction<T, any>[]) => {
  return (data: T) => (of(data || null) as any).pipe(...operators) as Observable<any>;
};

@Directive()
export abstract class BaseFormComponentDirective<TRecordModel extends PllRecordId> implements OnInit {
  public readonly userClass = input<ClassValue>("", { alias: "class" });
	protected readonly _computedClass = computed(() =>
		hlm("py-3 xl:px-6 px-2 xl:py-4 grid grid-cols-12 gap-3.5 gap-x-2", this.userClass()),
	);
  
  id = model<PllID>(null);
  closeOnSave = model<boolean>(true);
  isDialog = input<boolean>(false);

  abstract facade: PllFacade<TRecordModel, any, any, any>;
  private readonly _context = injectBrnDialogContext();

  orgRecord: TRecordModel;
  crrRecord: TRecordModel;

  form: PllFormSchema<TRecordModel>;
  formReady = signal<boolean>(false);

  loading = signal<boolean>(false);
  processing = signal<boolean>(false);

  onNgOnInit: EventObs<void> = event();
  onUpdateUI: EventObs<TRecordModel> = event();
  onInitRecord: EventObs<void> = event();
  onInitCreateRecord: EventObs<void> = event();
  onInitUpdateRecord: EventObs<void> = event();
  onInitSumit: EventObs<void> = event();
  onFinishSumit: EventObs<void> = event();

  async ngOnInit() {
    this.loading = this.facade.loading;
    this.processing = this.facade.processing;
    this.configureFormSchema();
    await this.onNgOnInit().pipe(
      switchMap(() => this.handleUpdateUI()),
    ).subscribe({
      error: error => this.handlePopulateForm().subscribe(),
    });
  };

  updateUI() {
    this.handleUpdateUI().subscribe({
      error: error => console.error(error),
    });
  };

  handleUpdateUI(): Observable<TRecordModel> {
    return of(this.id()).pipe(
      switchMap(id => {
        if(!id) return this.handlePopulateForm().pipe(tap(response => console.log("DEFAULT-DATA", response)));
        return this.facade.getRecord(id).pipe(
          tap(response => console.log("UPDATE-UI", response)),
          tap(response => this.orgRecord = response),
          tap(response => this.crrRecord = response),
          switchMap(response => this.handlePopulateForm(response)),
          switchMap(response => this.onUpdateUI(response)),
        );
      }),
    );
  };

  configureFormSchema() {
    this.form = new PllFormSchema(this.facade.recordSchema);
  };

  handlePopulateForm(data?: TRecordModel): Observable<TRecordModel> {
    return of(data).pipe(
      switchMap(response => {
        if(response) return this.form.setValue(data).pipe(switchMap(() => this.onInitUpdateRecord()));
        this.configureFormSchema();
        return this.onInitCreateRecord();
      }),
      switchMap(() => this.onInitRecord()),
      tap(() => this.formReady.set(true)),
      map(() => this.form.value),
    );
  };

  onSubmit() {
    this.handleSubmit().subscribe({
      error: error => console.error(error),
    });
  };

  handleSubmit(): Observable<TRecordModel> {
    return this.form.handleSubmit().pipe(
      switchMap(response => this.onInitSumit().pipe(map(() => response))),
      switchMap(response => !this.id()? this.facade.insertRecord(response) : this.facade.updateRecord(response)),
      tap(response => console.log(!this.id()? "INSERT-RECORD" : "UPDATE-RECORD", response)),
      tap(response => this.id.set(response.id)),
      tap(response => this.orgRecord = response),
      tap(response => this.crrRecord = response),
      switchMap(response => this.handlePopulateForm(response)),
      switchMap(() => this.onFinishSumit()),
      tap(() => this.closeOnSave() && this._context.close(this.crrRecord))
    );
  };

  back() {
    this._context.close();
  };

};