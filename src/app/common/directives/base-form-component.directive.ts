import { computed, Directive, inject, input, model, OnInit, output, signal } from "@angular/core";
import { PllFacade, PllID, PllRecordId } from "../../core/lib/pollaris";
import { PllFormSchema } from "../../core/lib/pollaris/forms";
import { catchError, map, Observable, of, OperatorFunction, switchMap, tap, throwError } from "rxjs";
import { injectBrnDialogContext } from "@spartan-ng/brain/dialog";
import { ClassValue } from "clsx";
import { hlm } from "@spartan-ng/brain/core";
import { AuthFacade } from "../../features/auth/facades/auth.facade";
import { toast } from 'ngx-sonner';
import { errorHandler } from "../operators/error-handler.operator";

export type EventObs<T = void, TR = any> = (data?: T) => Observable<TR>;
export const event = <T = void, TR = any>(...operators: OperatorFunction<T, TR>[]) => {
  return (data: T) => (of(data || null) as any).pipe(...operators) as Observable<TR>;
};

export type BaseFormSubmitConfig = {
  closeOnSave?: boolean;
};

@Directive()
export abstract class BaseFormComponentDirective<TRecordModel extends PllRecordId> implements OnInit {
  public readonly userClass = input<ClassValue>("", { alias: "class" });
  public readonly baseUserClass = signal<ClassValue>("h-full overflow-y-auto custom-scroll py-3 xl:px-6 px-2 xl:py-4");
	protected readonly _computedClass = computed(() => hlm(this.baseUserClass(), this.userClass()));

  public readonly formClass = input<ClassValue>("", { alias: "formClass" });
  public readonly baseFormClass = signal<ClassValue>("grid grid-cols-12 gap-3.5 gap-x-2");
	protected readonly _computedFormClass = computed(() => hlm(this.baseFormClass(), this.formClass()));
  
  id = model<PllID>(null);
  closeOnSave = model<boolean>(true);
  isDialog = input<boolean>(false);

  abstract facade: PllFacade<TRecordModel, any>;
  readonly _context = injectBrnDialogContext();
  
  authFacade = inject(AuthFacade);

  authData = this.authFacade.state.userData;
  isLoggedIn = this.authFacade.state.isLoggedIn;

  orgRecord: TRecordModel;
  crrRecord: TRecordModel;

  form: PllFormSchema<TRecordModel>;
  formReady = signal<boolean>(false);

  loading = signal<boolean>(false);
  processing = signal<boolean>(false);

  $evNgOnInit: EventObs = event();
  $evUpdateUI: EventObs<TRecordModel> = event();
  $evInitRecord: EventObs = event();
  $evInitCreateRecord: EventObs = event();
  $evInitUpdateRecord: EventObs = event();
  $evInitSumit: EventObs<TRecordModel> = event();
  $evNextSumit: EventObs<TRecordModel> = event();

  onNextSumit = output<TRecordModel>();
  
  async ngOnInit() {
    this._configureFormSchema();
    await this.$evNgOnInit().pipe(
      switchMap(() => this.$updateUI()),
    ).subscribe({
      error: () => this.$populateForm().subscribe(),
    });
  };

  updateUI() {
    this.$updateUI().pipe(errorHandler()).subscribe({
      error: () => this.loading.set(false),
    });
  };

  $updateUI(): Observable<TRecordModel> {
    this.loading.set(true);
    return of(this.id()).pipe(
      switchMap(id => {
        if(!id) return this.$populateForm().pipe(tap(response => console.log("DEFAULT-DATA", response)));
        return this.facade.getRecord(id).pipe(
          tap(response => console.log("UPDATE-UI", response)),
          tap(response => this.orgRecord = response),
          tap(response => this.crrRecord = response),
          switchMap(response => this.$populateForm(response)),
          switchMap(response => this.$evUpdateUI(response)),
          tap(() => this.loading.set(false)),
          catchError(error => {
            this.loading.set(false);
            return throwError(error);
          }),
        );
      }),
    );
  };

  private _configureFormSchema() {
    this.form = new PllFormSchema(this.facade.recordSchema);
  };

  $populateForm(data?: TRecordModel): Observable<TRecordModel> {
    return of(data).pipe(
      switchMap(response => {
        if(response) return this.form.setValue(data).pipe(switchMap(() => this.$evInitUpdateRecord()));
        this._configureFormSchema();
        return this.$evInitCreateRecord().pipe(
          tap(() => this.orgRecord = this.form.value),
          tap(() => this.crrRecord = this.form.value),
        );
      }),
      switchMap(() => this.$evInitRecord()),
      tap(() => this.formReady.set(true)),
      map(() => this.form.value),
    );
  };

  onSubmit(config: BaseFormSubmitConfig = {}) {
    this.$handleSubmit(config).pipe(errorHandler({ showWarning: true })).subscribe();
  };

  $handleSubmit({ closeOnSave }: BaseFormSubmitConfig = {}): Observable<TRecordModel> {
    this.processing.set(true);
    return this.form.handleSubmit().pipe(
      switchMap(response => this.$evInitSumit(response).pipe(map(() => response))),
      tap(response => console.log(!this.id()? "INSERT-RECORD" : "UPDATE-RECORD", response)),
      switchMap(response => !this.id()? this.facade.insertRecord(response) : this.facade.updateRecord(response)),
      tap(response => { 
        toast.success("SUCESSO!", { description: this.id()? "Registro Atualizado com Sucesso!" : "Registro Inserido com Sucesso!" });
        this.id.set(response.id);
        this.orgRecord = response;
        this.crrRecord = response;
      }),
      switchMap(() => this.$updateUI()),
      switchMap(response => this.$evNextSumit(response).pipe(tap(() => this.onNextSumit.emit(response)))),
      tap(() => ([true, false].includes(closeOnSave)? closeOnSave : this.closeOnSave()) && this._context.close(this.crrRecord)),
      tap(() => this.processing.set(false)),
      catchError(error => {
        this.processing.set(false);
        return throwError(error);
      }),
    );
  };

  back() {
    this._context.close();
  };

};