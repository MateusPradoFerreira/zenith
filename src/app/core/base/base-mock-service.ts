import { delay, mergeMap, Observable, of, switchMap, throwError } from "rxjs";
import { ObjectId } from "../types/form-schema.type";
import { BaseService } from "./base-service";
import { fakerJs } from "../config/faker.config";

export abstract class BaseMockService<TModel extends ObjectId> extends BaseService<TModel> {
  registries: TModel[] = [];

  constructor() {
    super();
    this._populateInitialValues();
  };

  abstract createRegistry(props?: Partial<TModel>): TModel;

  private _populateInitialValues() {
    for(let index of Array.from(Array(fakerJs.number.int({ min: 10, max: 50 })).keys())) this.registries.push(this.createRegistry());
  };

  override get(id: string): Observable<TModel> {
    const registry = this.registries.find(reg => reg.id === id);
    return of(registry).pipe(delay(fakerJs.number.int({ min: 50, max: 300 })), mergeMap(registry => registry? of(registry) : throwError(() => new Error("Not Found")))) as Observable<TModel>;
  };
  
  override put(data: TModel): Observable<TModel> {
    return of(data).pipe(switchMap(registry => this.delete(registry.id)), switchMap(registry => this.post(registry))) as Observable<TModel>;
  };

  override post(data: TModel): Observable<TModel> {
    return of(this.createRegistry(data)).pipe(delay(fakerJs.number.int({ min: 50, max: 300 })), switchMap(registry => {
      this.registries.push(registry);
      return of(registry);
    })) as Observable<TModel>;
  };

  override delete(id: string): Observable<TModel> {
    return of(id).pipe(delay(fakerJs.number.int({ min: 50, max: 300 })), switchMap(id => this.get(id)), switchMap(registry => {
      this.registries = this.registries.filter(registry => registry.id !== id);
      return of(registry);
    })) as Observable<TModel>;
  };

};