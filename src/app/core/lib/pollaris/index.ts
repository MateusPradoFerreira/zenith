import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { computed, inject, signal, Type } from "@angular/core";
import { catchError, concatMap, delay, from, map, Observable, of, switchMap, tap, throwError, toArray } from "rxjs";
import { PllFormSchemaConfig } from "./forms";
import { DialogFacade, Inputkeys } from "../../../common/facades/dialog.facade";
import { BaseFormComponentDirective, event, EventObs } from "../../../common/directives/base-form-component.directive";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";
import { faker } from "@faker-js/faker";
import sift, { Query } from "sift";
import { v4 as uuid } from 'uuid';

export type PllID = string;
export type PllRecord = Record<any, any>;
export type PllRecordId = PllRecord & { id: PllID };

export type PllPagination = {
  page: number;
  size: number;
  total: number;
  sort: "ASC" | "DESC",
};

export type PllPaginatedResponse<TRecordModel extends PllRecordId> = {
  data: TRecordModel[];
  pagination: PllPagination;
};

export abstract class PllRecordState<TRecordModel extends PllRecordId> {
  private _data = signal<Map<PllID, TRecordModel>>(new Map());
  data = computed(() => Array.from(this._data().values()).map(record => record));
  
  get(id: PllID): TRecordModel | null {
    const registry = this._data().get(id);
    if(!registry) return null;
    return registry;
  };

  set(dataArr: TRecordModel[]) {
    this.clear();
    this.insertMany(dataArr);
  };

  insert(data: TRecordModel) {
    const newHashMap: Map<PllID, TRecordModel> = new Map(this._data());
    newHashMap.set(data.id, data);
    this._data.set(newHashMap);
    return data;
  };

  insertMany(dataArr: TRecordModel[]) {
    const newHashMap: Map<PllID, TRecordModel> = new Map(this._data());
    for(let data of dataArr) newHashMap.set(data.id, data);
    this._data.set(newHashMap);
    return dataArr;
  };

  update(data: TRecordModel) {
    const newHashMap: Map<PllID, TRecordModel> = new Map(this._data());
    newHashMap.set(data.id, data);
    this._data.set(newHashMap);
    return data;
  };

  updateMany(dataArr: TRecordModel[]) {
    const newHashMap: Map<PllID, TRecordModel> = new Map(this._data());
    for(let data of dataArr) newHashMap.set(data.id, data);
    this._data.set(newHashMap);
    return dataArr;
  };

  remove(id: PllID) {
    const newHashMap: Map<PllID, TRecordModel> = new Map(this._data());
    newHashMap.delete(id);
    this._data.set(newHashMap);
  };

  clear() {
    const newHashMap: Map<PllID, TRecordModel> = new Map();
    this._data.set(newHashMap);
  };
};

export abstract class PllRecordRepository<TRecordModel extends PllRecordId> {
  abstract state: PllRecordState<TRecordModel>;

  $find(query?: Query<TRecordModel>, pagination?: Partial<PllPagination>): Observable<PllPaginatedResponse<TRecordModel>> {
    return of(this.find(query, pagination));
  };

  find(query?: Query<TRecordModel>, pagination?: Partial<PllPagination>): PllPaginatedResponse<TRecordModel> {
    const formatedQuery = this._formatQuery(query);
    const filteredData = this.state.data().filter(sift(formatedQuery));

    const defaultPagination: PllPagination = { page: 1, size: 50, total: 1, sort: "ASC" };
    const finalPagination: PllPagination = {
      ...defaultPagination,
      ...pagination,
      total: filteredData.length,
    };

    const paginationStart = (finalPagination.page - 1) * finalPagination.size;
    const paginationEnd = paginationStart + finalPagination.size;

    if(finalPagination.sort === "DESC") filteredData.reverse();
    const data = !pagination? filteredData : filteredData.slice(paginationStart, paginationEnd);
    
    const response: PllPaginatedResponse<TRecordModel> = { data, pagination: finalPagination};
    return response;
  };

  $findOne(query: Query<TRecordModel>): Observable<TRecordModel | null> {
    const formatedQuery = this._formatQuery(query);
    return of(this.state.data().find(sift(formatedQuery)) || null);
  };

  $count(query?: Query<TRecordModel>): Observable<number> {
    const formatedQuery = this._formatQuery(query);
    return of(this.state.data().filter(sift(formatedQuery)).length);
  };

  create(data: TRecordModel) {
    const record = { ...data, id: data.id || uuid() };
    this.state.insert(record);
    return record;
  };

  update(data: TRecordModel) {
    this.state.update(data);
    return { ...data };
  };

  private _formatQuery(query?: Query<TRecordModel>): Query<TRecordModel> {
    if(!query) return {} as Query<TRecordModel>;
    return Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined)) as Query<TRecordModel>;
  };
};

export abstract class PllRestService<TRecordModel extends PllRecordId> {
  abstract baseRoute: string;
  abstract pathRoute: string;

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

export abstract class PllMockRestService<TRecordModel extends PllRecordId> extends PllRestService<TRecordModel> {
  abstract repository: PllRecordRepository<TRecordModel>;

  override baseRoute: string = "";
  override pathRoute: string = "";

  protected minDelay: number = 100;
  protected maxDelay: number = 500;

  protected $evGet: EventObs<TRecordModel, TRecordModel> = event();
  protected $evInitPost: EventObs<TRecordModel, TRecordModel> = event();
  protected $evNextPost: EventObs<TRecordModel> = event();
  protected $evInitPut: EventObs<TRecordModel, TRecordModel> = event();
  protected $evNextPut: EventObs<TRecordModel> = event();
  protected $evInitDelete: EventObs<TRecordModel> = event();
  protected $evNextDelete: EventObs<TRecordModel> = event();

  override get(id: PllID): Observable<TRecordModel> {
    return of(this.repository.state.get(id)).pipe(
      delay(this.delay()), 
      switchMap(response => {
        if(!response) return throwError(() => new HttpErrorResponse({ status: 404, error: new Error("Not Found Record!") }));
        return this.$evGet(response).pipe(map(record => record || response));
      }),
    );
  };

  override post(data: TRecordModel): Observable<TRecordModel> {
    return of(data).pipe(
      delay(this.delay()), 
      switchMap(response => this.$evInitPost(response).pipe(map(record => record || response))),
      map(response => this.repository.create(response)),
      switchMap(response => this.$evNextPost(response).pipe(map(() => response))),
    );
  };

  override postMany(data: TRecordModel[]): Observable<TRecordModel[]> {
    return from(data).pipe(
      concatMap(record => this.post(record)),
      toArray(),
    );
  };

  override put(data: TRecordModel): Observable<TRecordModel> {
    return this.get(data.id).pipe(
      map(response => ({ ...response, ...data })),
      switchMap(response => this.$evInitPut(response).pipe(map(record => record || response))),
      map(response => this.repository.update(response)),
      switchMap(response => this.$evNextPut(response).pipe(map(() => response))),
    );
  };

  override putMany(data: TRecordModel[]): Observable<TRecordModel[]> {
    return from(data).pipe(
      concatMap(record => this.put(record)),
      toArray(),
    );
  };

  override delete(id: PllID): Observable<TRecordModel> {
    return this.get(id).pipe(
      switchMap(response => this.$evInitDelete(response).pipe(map(() => response))),
      tap(() => this.repository.state.remove(id)),
      switchMap(response => this.$evNextDelete(response).pipe(map(() => response))),
    );
  };

  override deleteMany(ids: PllID[]): Observable<TRecordModel[]> {
    return from(ids).pipe(
      concatMap(id => this.delete(id)),
      toArray(),
    );
  };

  protected delay() {
    return faker.number.int({ min: this.minDelay, max: this.maxDelay });
  };

  protected merge<TFirstRecord, TSecondRecord>(records: TFirstRecord[], builder: (record: TFirstRecord) => Partial<TFirstRecord> & Omit<TSecondRecord, keyof TFirstRecord>): TSecondRecord[] {
    return records.map(record => {
      const newRecord: any = { ...record, ...builder(record) };
      return newRecord;
    });
  };
};

export abstract class PllRecordMapper<TInternalModel extends PllRecordId, TExternalModel extends PllRecordId = TInternalModel> {
  abstract to(data: TInternalModel): TExternalModel;
  abstract from(data: TExternalModel): TInternalModel;
};

export abstract class PllFacade<TRecordModel extends PllRecordId, TComponent extends BaseFormComponentDirective<TRecordModel> = BaseFormComponentDirective<TRecordModel>> {
  abstract state: PllRecordState<TRecordModel>;
  abstract service: PllRestService<TRecordModel>;

  abstract recordSchema: PllFormSchemaConfig<TRecordModel>;

  abstract header: string;
  abstract component: Type<any>;
  abstract dialogSize: DialogContentVariants["size"];
  abstract dialogAlign: DialogContentVariants["align"];
  abstract closeOnSave: boolean;

  dialogFacade = inject(DialogFacade);

  getRecord(id: PllID): Observable<TRecordModel> {
    return of(this.state.get(id)).pipe(
      switchMap(record => {
        if(record) return of(record);
        return this.service.get(id).pipe(tap(response => this.state.insert(response)));
      }),
      catchError(error => throwError(error)),
    );
  };

  insertRecord(data: TRecordModel): Observable<TRecordModel> {
    return of(data).pipe(
      switchMap(record => this.service.post(record)),
      catchError(error => throwError(error)),
    );
  };

  updateRecord(data: TRecordModel): Observable<TRecordModel> {
    return of(data).pipe(
      switchMap(record => this.service.put(record)),
      tap(response => this.state.remove(response.id)),
      catchError(error => throwError(error)),
    );
  };

  updateManyRecords(data: TRecordModel[]): Observable<TRecordModel[]> {
    return of(data.map(reg => reg)).pipe(
      switchMap(records => this.service.putMany(records)),
      tap(records => records.map(record => this.state.remove(record.id))),
      catchError(error => throwError(error)),
    );
  };

  deleteRecord(id: PllID): Observable<TRecordModel> {
    return this.service.delete(id).pipe(
      tap(() => this.state.remove(id)),
      catchError(error => throwError(error)),
    );
  };

  deleteManyRecords(ids: PllID[]): Observable<TRecordModel[]> {
    return this.service.deleteMany(ids).pipe(
      tap(() => ids.map(id => this.state.remove(id))),
      catchError(error => throwError(error)),
    );
  };

  openToCreate(inputs: Inputkeys<BaseFormComponentDirective<TRecordModel>> & Inputkeys<TComponent> = {}): Observable<any> {
    return this.dialogFacade.open<BaseFormComponentDirective<TRecordModel>>(this.component, {
      header: this.header,
      size: this.dialogSize,
      align: this.dialogAlign,
      inputs: { ...inputs, closeOnSave: this.closeOnSave },
    }).closed$;
  };

  openToUpdate(id: PllID, inputs: Inputkeys<BaseFormComponentDirective<TRecordModel>> & Inputkeys<TComponent> = {}): Observable<any> {
    return this.dialogFacade.open<BaseFormComponentDirective<TRecordModel>>(this.component, {
      header: this.header,
      size: this.dialogSize,
      align: this.dialogAlign,
      inputs: { ...inputs, closeOnSave: this.closeOnSave, id },
    }).closed$;
  };

  openToDelete(id: PllID): Observable<TRecordModel> {
    return this.dialogFacade.confirmRequest(this.deleteRecord(id), "Excluir registro?", "danger");
  };

  openToDeleteMany(ids: PllID[]): Observable<TRecordModel[]> {
    return this.dialogFacade.confirmRequest(this.deleteManyRecords(ids), "Excluir registros?", "danger");
  };
};

export abstract class PllQueryFacade<TRecordQueryModel extends PllRecordId, TRecordQueryParams extends PllRecord = any> {
  abstract service: PllRestService<any>;
  abstract queryFn: (params: TRecordQueryParams) => Observable<PllPaginatedResponse<TRecordQueryModel>>;

  abstract filterSchema: PllFormSchemaConfig<TRecordQueryParams>;
  
  useQuery(params: TRecordQueryParams): Observable<PllPaginatedResponse<TRecordQueryModel>> {
    return this.queryFn(params).pipe(catchError(error => throwError(error)));
  };
};