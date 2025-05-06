import { inject, Injectable } from "@angular/core";
import { Receivable } from "../models/receivable.model";
import { GetAllReceivableByFilterParams, ReceivableService } from "../services/receivable.service";
import { BaseFacade, BaseFacadeList } from "../../../core/base/base-facade";
import { FormSchemaConfig, ID } from "../../../core/types/form-schema.type";
import { Validators } from "@angular/forms";
import { Observable, switchMap } from "rxjs";

@Injectable({ providedIn: "root" })
export class ReceivableFacade extends BaseFacade<Receivable> implements BaseFacadeList<Receivable, GetAllReceivableByFilterParams> {
  override service: ReceivableService = inject(ReceivableService);
  
  override formSchema: FormSchemaConfig<Receivable, Receivable> = {
    id: { defaultValue: null },
    centerOfCostId: { defaultValue: null, validators: [Validators.required] },
    planOfAccountId: { defaultValue: null, validators: [Validators.required] },
    secrecyId: { defaultValue: null, validators: [Validators.required] },
    docNumber: { defaultValue: String("").padStart(10, "0"), validators: [Validators.required], disabled: true },
    name: { defaultValue: null, validators: [Validators.required] },
    value: { defaultValue: 0, validators: [Validators.min(0), Validators.required] },
    dueAt: { defaultValue: null },
    paidAt: { defaultValue: null, disabled: true },
    createdAt: { defaultValue: new Date(), disabled: true },
    status: { defaultValue: "PENDING" },
    description: { defaultValue: null },
    active: { defaultValue: true },
  };

  getByAllFilters(params: GetAllReceivableByFilterParams): Observable<Receivable[]> {
    return this.service.getAllByFilter(params);
  };

  cancel(id: ID): Observable<Receivable> {
    return this.service.get(id).pipe(switchMap(res => this.service.put({ ...res, active: false, status: "CANCELED" })));
  };
};