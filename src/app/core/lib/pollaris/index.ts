import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { computed, inject, signal, Type } from "@angular/core";
import { catchError, concatMap, delay, from, map, Observable, of, reduce, Subject, switchMap, tap, throwError, toArray } from "rxjs";
import { PllFormSchemaConfig } from "./forms";
import { faker } from "@faker-js/faker";
import { DialogFacade, Inputkeys } from "../../../common/facades/dialog.facade";
import { BaseFormComponentDirective } from "../../../common/directives/base-form-component.directive";
import moment from "moment";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type PllID = string;
export type PllRecord = Record<any, any>;
export type PllRecordId = PllRecord & { id: PllID };
export type PllPaginatedResponse<TRecordModel extends PllRecordId> = {
  data: TRecordModel[];
  pagination: {
    page: number;
  };
};
export abstract class PllRecordState<TRecordModel extends PllRecordId> {
  private _records = signal<Map<PllID, { data: TRecordModel, date: Date }>>(new Map());
  records = computed(() => Array.from(this._records().values()).map(record => record.data));
  
  timestemp: number = 5;
  unitOfTime: moment.unitOfTime.Diff = "minutes";

  get(id: PllID): TRecordModel | null {
    const registry = this._records().get(id);
    if(!registry) return null;
    if(moment().diff(registry.date, this.unitOfTime) >= this.timestemp) {
      this.remove(id);
      return null;
    };
    return registry.data;
  };

  set(dataArr: TRecordModel[]) {
    this.clear();
    this.insertMany(dataArr);
  };

  insert(data: TRecordModel) {
    const newHashMap: Map<PllID, { data: TRecordModel, date: Date }> = new Map(this._records());
    newHashMap.set(data.id, { data, date: new Date() });
    this._records.set(newHashMap);
  };

  insertMany(dataArr: TRecordModel[]) {
    const newHashMap: Map<PllID, { data: TRecordModel, date: Date }> = new Map(this._records());
    for(let data of dataArr) newHashMap.set(data.id, { data, date: new Date() });
    this._records.set(newHashMap);
  };

  remove(id: PllID) {
    const newHashMap: Map<PllID, { data: TRecordModel, date: Date }> = new Map(this._records());
    newHashMap.delete(id);
    this._records.set(newHashMap);
  };

  update(data: TRecordModel) {
    const newHashMap: Map<PllID, { data: TRecordModel, date: Date }> = new Map(this._records());
    newHashMap.set(data.id, { data, date: new Date() });
    this._records.set(newHashMap);
  };

  clear() {
    const newHashMap: Map<PllID, { data: TRecordModel, date: Date }> = new Map();
    this._records.set(newHashMap);
  };
};

export abstract class PllRestService<TRecordModel extends PllRecordId> {
  abstract baseRoute: string;
  abstract pathRoute: string;

  records = signal<TRecordModel[]>([]);

  http = inject(HttpClient);

  get(id: PllID): Observable<TRecordModel> {
    return this.http.get<TRecordModel>(`${this.baseRoute}/${this.pathRoute}/${id}`);
  };

  post(data: TRecordModel): Observable<TRecordModel> {
    return this.http.post<TRecordModel>(`${this.baseRoute}/${this.pathRoute}`, data);
  };

  postMany(data: TRecordModel[]): Observable<TRecordModel[]> {
    return this.http.post<TRecordModel[]>(`${this.baseRoute}/${this.pathRoute}/many`, data);
  };

  put(data: TRecordModel): Observable<TRecordModel> {
    return this.http.put<TRecordModel>(`${this.baseRoute}/${this.pathRoute}/${data.id}`, data);
  };

  putMany(data: TRecordModel[]): Observable<TRecordModel[]> {
    return this.http.put<TRecordModel[]>(`${this.baseRoute}/${this.pathRoute}/many`, data);
  };

  delete(id: PllID): Observable<TRecordModel> {
    return this.http.delete<TRecordModel>(`${this.baseRoute}/${this.pathRoute}/${id}`);
  };

  deleteMany(ids: PllID[]): Observable<TRecordModel[]> {
    return this.http.delete<TRecordModel[]>(`${this.baseRoute}/${this.pathRoute}/${ids.join()}/many`);
  };
};

export abstract class PllMockedRestService<TRecordModel extends PllRecordId> extends PllRestService<TRecordModel> {
  override baseRoute: string = "";
  override pathRoute: string = "";

  minDelay: number = 50;
  maxDelay: number = 400;

  abstract createRecord(data: Partial<TRecordModel>): TRecordModel;

  constructor (initialData: TRecordModel[] = []) {
    super();
    this.records.set(initialData);
  };

  override get(id: PllID): Observable<TRecordModel> {
    return of(this.records().find(record => record.id === id)).pipe(delay(faker.helpers.rangeToNumber({ min: this.minDelay, max: this.maxDelay })), tap(response => {
      if(!response) throw new HttpErrorResponse({ status: 404, error: new Error("Not Found Record!") });
    }));
  };

  override post(data: TRecordModel): Observable<TRecordModel> {
    return of(this.createRecord(data)).pipe(delay(faker.helpers.rangeToNumber({ min: this.minDelay, max: this.maxDelay })), tap(response => {
      this.records.set([ ...this.records(), response ]);
    }));
  };

  override postMany(data: TRecordModel[]): Observable<TRecordModel[]> {
    return of(data.map(record => this.createRecord(record))).pipe(delay(faker.helpers.rangeToNumber({ min: this.minDelay, max: this.maxDelay })), tap(response => {
      this.records.set([ ...this.records(), ...response ]);
    }));
  };

  override put(data: TRecordModel): Observable<TRecordModel> {
    return of(data).pipe(delay(faker.helpers.rangeToNumber({ min: this.minDelay, max: this.maxDelay })), tap(response => {
      this.records.set(this.records().map(record => record.id !== response.id? record : response));
    }));
  };

  override putMany(data: TRecordModel[]): Observable<TRecordModel[]> {
    return of(data).pipe(delay(faker.helpers.rangeToNumber({ min: this.minDelay, max: this.maxDelay })), tap(response => {
      this.records.set(this.records().map(record => {
        const mapRecord = response.find(rec => rec.id === record.id);
        return mapRecord || record;
      }));
    }));
  };

  override delete(id: PllID): Observable<TRecordModel> {
    return this.get(id).pipe(tap(response => {
      this.records.set(this.records().filter(record => record.id !== response.id));
    }));
  };

  override deleteMany(ids: PllID[]): Observable<TRecordModel[]> {
    return from(ids).pipe(
      concatMap(id => this.delete(id)),
      toArray(),
    );
  };
};

export abstract class PllRecordMapper<TInternalModel extends PllRecordId, TExternalModel extends PllRecordId = TInternalModel> {
  abstract to(data: TInternalModel): TExternalModel;
  abstract from(data: TExternalModel): TInternalModel;
};

export abstract class PllFacade<TRecordModel extends PllRecordId, TExternalModel extends PllRecordId = TRecordModel, TRecordQueryModel extends PllRecordId = TRecordModel, TRecordQueryParams extends PllRecord = any, TComponent extends BaseFormComponentDirective<TRecordModel> = BaseFormComponentDirective<TRecordModel>> {
  abstract state: PllRecordState<TExternalModel>;
  abstract service: PllRestService<TExternalModel>;
  abstract mapper: PllRecordMapper<TRecordModel, TExternalModel>;
  abstract queryFn: (params: TRecordQueryParams) => Observable<PllPaginatedResponse<TRecordQueryModel>>;

  abstract recordSchema: PllFormSchemaConfig<TRecordModel>;
  abstract filterSchema: PllFormSchemaConfig<TRecordQueryParams>;

  abstract header: string;
  abstract component: Type<any>;
  abstract dialogWidth: DialogContentVariants["width"];
  abstract closeOnSave: boolean;

  public readonly data = signal<PllPaginatedResponse<TRecordQueryModel>>({
    data: [],
    pagination: {
      page: 1,
    },
  });

  dialogFacade = inject(DialogFacade);

  loading = signal<boolean>(false);
  processing = signal<boolean>(false);

  useQuery(params: TRecordQueryParams): Observable<PllPaginatedResponse<TRecordQueryModel>> {
    this.loading.set(true);
    return this.queryFn(params).pipe(
      tap(response => this.data.set(response)),
      tap(() => this.loading.set(false)),
      catchError(error => {
        this.loading.set(false);
        return throwError(error);
      }),
    );
  };

  clearData() {
    this.data.set({
      data: [],
      pagination: {
        page: 1,
      },
    });
  };

  getRecord(id: PllID): Observable<TRecordModel> {
    this.loading.set(true);
    return of(this.state.get(id)).pipe(
      switchMap(record => {
        if(record) return of(record);
        return this.service.get(id).pipe(tap(response => this.state.insert(response)));
      }),
      tap(() => this.loading.set(false)),
      map((response => this.mapper.from(response))),
      catchError(error => {
        this.processing.set(false);
        return throwError(error);
      }),
    );
  };

  insertRecord(data: TRecordModel): Observable<TExternalModel> {
    this.processing.set(true);
    return of(this.mapper.to(data)).pipe(
      switchMap(record => this.service.post(record)),
      tap(reponse => this.state.insert(reponse)),
      tap(() => this.processing.set(false)),
      catchError(error => {
        this.processing.set(false);
        return throwError(error);
      }),
    );
  };

  updateRecord(data: TRecordModel): Observable<TExternalModel> {
    this.processing.set(true);
    return of(this.mapper.to(data)).pipe(
      switchMap(record => this.service.put(record)),
      tap(reponse => this.state.update(reponse)),
      tap(() => this.processing.set(false)),
      catchError(error => {
        this.processing.set(false);
        return throwError(error);
      }),
    );
  };

  updateManyRecords(data: TRecordModel[]): Observable<TExternalModel[]> {
    this.processing.set(true);
    return of(data.map(reg => this.mapper.to(reg))).pipe(
      switchMap(records => this.service.putMany(records)),
      tap(records => records.map(record => this.state.update(record))),
      tap(() => this.processing.set(false)),
      catchError(error => {
        this.processing.set(false);
        return throwError(error);
      }),
    );
  };

  deleteRecord(id: PllID): Observable<TExternalModel> {
    this.processing.set(true);
    return this.service.delete(id).pipe(
      tap(() => this.state.remove(id)),
      tap(() => this.processing.set(false)),
      catchError(error => {
        this.processing.set(false);
        return throwError(error);
      }),
    );
  };

  deleteManyRecords(ids: PllID[]): Observable<TExternalModel[]> {
    this.processing.set(true);
    return this.service.deleteMany(ids).pipe(
      tap(() => ids.map(id => this.state.remove(id))),
      tap(() => this.processing.set(false)),
      catchError(error => {
        this.processing.set(false);
        return throwError(error);
      }),
    );
  };

  openToCreate(inputs: Inputkeys<BaseFormComponentDirective<TRecordModel>> & Inputkeys<TComponent> = {}): Observable<any> {
    return this.dialogFacade.open<BaseFormComponentDirective<TRecordModel>>(this.component, {
      header: this.header,
      width: this.dialogWidth,
      inputs: { ...inputs, closeOnSave: this.closeOnSave },
    }).closed$;
  };

  openToUpdate(id: PllID, inputs: Inputkeys<BaseFormComponentDirective<TRecordModel>> & Inputkeys<TComponent> = {}): Observable<any> {
    return this.dialogFacade.open<BaseFormComponentDirective<TRecordModel>>(this.component, {
      header: this.header,
      width: this.dialogWidth,
      inputs: { ...inputs, closeOnSave: this.closeOnSave, id },
    }).closed$;
  };

  openToDelete(id: PllID): Observable<TRecordModel> {
    const obs$ = new Subject<TRecordModel>();
    this.dialogFacade.confirm({
      header: "Excluir registro?",
      severity: "danger",
      events: {
        onConfirm: () => this.deleteRecord(id).subscribe({
          next: response => {
            obs$.next(response);
            obs$.complete();
          },
          error: error => {
            obs$.error(error);
            obs$.complete();
          },
        }),
        onCancel: () => obs$.complete(),
      },
    });
    return obs$.asObservable();
  };

  openToDeleteMany(ids: PllID[]): Observable<TRecordModel[]> {
    const obs$ = new Subject<TRecordModel[]>();
    this.dialogFacade.confirm({
      header: "Excluir registros?",
      severity: "danger",
      events: {
        onConfirm: () => this.deleteManyRecords(ids).subscribe({
          next: response => {
            obs$.next(response);
            obs$.complete();
          },
          error: error => {
            obs$.error(error);
            obs$.complete();
          },
        }),
        onCancel: () => obs$.complete(),
      },
    });
    return obs$.asObservable();
  };

};