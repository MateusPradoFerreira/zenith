import { inject, Injectable } from "@angular/core";
import { GetAllPayableResponse, Payable } from "../models/payable.model";
import { GetAllPayableByFilterParams, PayableService } from "../services/payable.service";
import { BaseFacade, BaseFacadeList } from "../../../core/base/base-facade";
import { FormSchemaConfig } from "../../../core/types/form-schema.type";
import { Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class PayableFacade extends BaseFacade<Payable> implements BaseFacadeList<GetAllPayableResponse, GetAllPayableByFilterParams> {
  override service: PayableService = inject(PayableService);
  
  override formSchema: FormSchemaConfig<Payable, Payable> = {
    id: { defaultValue: null },
    name: { defaultValue: null, validators: [Validators.required], refiners: [() => { throw new Error("teste") }] },
    value: { defaultValue: 0, validators: [Validators.min(0), Validators.required] },
  };

  getByAllFilters(params: GetAllPayableByFilterParams): Observable<GetAllPayableResponse[]> {
    return this.service.getAllByFilter(params);
  };
};