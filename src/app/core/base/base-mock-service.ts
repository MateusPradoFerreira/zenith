import { delay, mergeMap, Observable, of, switchMap, throwError } from "rxjs";
import { ID, ObjectId } from "../types/form-schema.type";
import { BaseService } from "./base-service";
import { fakerJs } from "../config/faker.config";

export type BaseMockServiceConfig<TModel> = {
  initialData?: TModel[];
  min?: number,
  max?: number,
}

export abstract class BaseMockService<TModel extends ObjectId> extends BaseService<TModel> {
  override route: string = "";

  registries: TModel[] = [];

  private _min: number = 10;
  private _max: number = 50;

  constructor({ initialData, max, min }: BaseMockServiceConfig<TModel> = {}) {
    super();
    this._min = min || 10;
    this._max = max || 50;
    this.registries = initialData || [];
    this._populateInitialValues();
  };

  abstract create(props?: Partial<TModel>): TModel;

  private _populateInitialValues() {
    if(this.registries.length) return;
    for(let index of Array.from(Array(fakerJs.number.int({ min: this._min, max: this._max })).keys())) this.registries.push(this.create());
  };

  override get(id: ID): Observable<TModel> {
    const registry = this.registries.find(reg => reg.id === id);
    return of(registry).pipe(delay(fakerJs.number.int({ min: 50, max: 300 })), mergeMap(registry => registry? of(registry) : throwError(() => new Error("Not Found")))) as Observable<TModel>;
  };
  
  override put(data: TModel): Observable<TModel> {
    return of(data).pipe(switchMap(registry => this.delete(registry.id)), switchMap(() => this.post(data))) as Observable<TModel>;
  };

  override post(data: TModel): Observable<TModel> {
    return of(this.create(data)).pipe(delay(fakerJs.number.int({ min: 50, max: 300 })), switchMap(registry => {
      this.registries.push(registry);
      return of(registry);
    })) as Observable<TModel>;
  };

  override delete(id: ID): Observable<TModel> {
    return of(id).pipe(delay(fakerJs.number.int({ min: 50, max: 300 })), switchMap(id => this.get(id)), switchMap(registry => {
      this.registries = this.registries.filter(registry => registry.id !== id);
      return of(registry);
    })) as Observable<TModel>;
  };

  filterByStatus(data: (TModel & { active: boolean })[], status: "ALL" | "ACTIVE" | "INACTIVE"): TModel[] {
    return data.filter(reg => status === "ALL"? true : (status === "ACTIVE"? reg.active : !reg.active));
  };

};