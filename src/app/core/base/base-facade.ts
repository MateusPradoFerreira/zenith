import { Observable } from "rxjs";
import { BaseService } from "./base-service";
import { FormSchemaConfig, ObjectId, PMapper } from "../types/form-schema.type";

export abstract class BaseFacade<TModel extends ObjectId, TMapper extends PMapper<TModel> = TModel> {
  abstract service: BaseService<TModel>;
  abstract formSchema: FormSchemaConfig<TModel, TMapper>;

  get(id: string): Observable<TModel> { 
    return this.service.get(id);
  };
};

export abstract class BaseFacadeList<TModel extends ObjectId, params = any> {
  abstract getByAllFilters: (params: params) => Observable<TModel[]>;
};