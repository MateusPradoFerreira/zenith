import { inject, Injectable } from "@angular/core";
import { Payable } from "../models/payable.model";
import { GetAllPayableByFilterParams, PayableService } from "../services/payable.service";
import { BaseFacade, BaseFacadeList } from "../../../core/base/base-facade";
import { FormSchemaConfig } from "../../../core/types/form-schema.type";
import { Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class PayableFacade extends BaseFacade<Payable> implements BaseFacadeList<Payable, GetAllPayableByFilterParams> {
  override service: PayableService = inject(PayableService);
  
  override formSchema: FormSchemaConfig<Payable, Payable> = {
    id: { defaultValue: null },
    categoryIds: { defaultValue: [] },
    name: { defaultValue: null, validators: [Validators.required] },
    value: { defaultValue: 0, validators: [Validators.min(0), Validators.required] },
    dueAt: { defaultValue: null },
    paidAt: { defaultValue: null },
    createdAt: { defaultValue: new Date() },
    status: { defaultValue: "PENDING" },
    description: { defaultValue: null },
  };

  getByAllFilters(params: GetAllPayableByFilterParams): Observable<Payable[]> {
    return this.service.getAllByFilter(params);
  };
};