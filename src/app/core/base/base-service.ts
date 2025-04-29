import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ObjectId } from "../types/form-schema.type";

export abstract class BaseService<TModel extends ObjectId> {
  http: HttpClient = inject(HttpClient);
  abstract route: string;

  get(id: string): Observable<TModel> {
    console.log("environment", environment)
    return this.http.get(`${environment.apiUrl}/${this.route}/${id}`) as Observable<TModel>;
  };
  
  put(data: TModel): Observable<TModel> {
    return this.http.put(`${environment.apiUrl}/${this.route}/${data.id}`, data) as Observable<TModel>;
  };

  post(data: TModel): Observable<TModel> {
    return this.http.post(`${environment.apiUrl}/${this.route}/${data.id}`, data) as Observable<TModel>;
  };

  delete(id: string): Observable<TModel> {
    return this.http.delete(`${environment.apiUrl}/${this.route}/${id}`) as Observable<TModel>;
  };
};

