import { inject, Injectable } from "@angular/core";
import { CenterOfCost } from "../models/center-of-cost.model";
import { GetAllCenterOfCostByFilterParams, CenterOfCostService } from "../services/center-of-cost.service";
import { BaseFacade, BaseFacadeList } from "../../../core/base/base-facade";
import { FormSchemaConfig } from "../../../core/types/form-schema.type";
import { Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class CenterOfCostFacade extends BaseFacade<CenterOfCost> implements BaseFacadeList<CenterOfCost, GetAllCenterOfCostByFilterParams> {
  override service: CenterOfCostService = inject(CenterOfCostService);
  
  override formSchema: FormSchemaConfig<CenterOfCost, CenterOfCost> = {
    id: { defaultValue: null },
    name: { defaultValue: null, validators: [Validators.required] },
    active: { defaultValue: true },
    default: { defaultValue: false },
  };

  getByAllFilters(params: GetAllCenterOfCostByFilterParams): Observable<CenterOfCost[]> {
    return this.service.getAllByFilter(params);
  };
};