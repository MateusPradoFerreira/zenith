import { inject, Injectable } from "@angular/core";
import { Secrecy } from "../models/secrecy.model";
import { GetAllSecrecyByFilterParams, SecrecyService } from "../services/secrecy.service";
import { BaseFacade, BaseFacadeList } from "../../../core/base/base-facade";
import { FormSchemaConfig } from "../../../core/types/form-schema.type";
import { Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class SecrecyFacade extends BaseFacade<Secrecy> implements BaseFacadeList<Secrecy, GetAllSecrecyByFilterParams> {
  override service: SecrecyService = inject(SecrecyService);
  
  override formSchema: FormSchemaConfig<Secrecy, Secrecy> = {
    id: { defaultValue: null },
    name: { defaultValue: null, validators: [Validators.required] },
    active: { defaultValue: true },
    default: { defaultValue: false },
  };

  getByAllFilters(params: GetAllSecrecyByFilterParams): Observable<Secrecy[]> {
    return this.service.getAllByFilter(params);
  };
};