import { PllMockedRestService, PllPaginatedResponse } from "@pollaris";
import { CenterOfCost } from "../models/center-of-cost.model";
import { GetAllCenterOfCostByFilterParams, GetAllCenterOfCostByFilterResponse, CenterOfCostService } from "./center-of-cost.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';

export function createMokedCenterOfCost(data: Partial<CenterOfCost>): CenterOfCost {
  return new CenterOfCost({
    active: true,
    ...data,
    id: data.id || uuid(),
  });
};

export const INITIAL_CENTER_OF_COST_MOCKED_DATA: CenterOfCost[] = [
  createMokedCenterOfCost({ name: "Geral" }),
  createMokedCenterOfCost({ name: "Marketing" }),
  createMokedCenterOfCost({ name: "Vendas" }),
  createMokedCenterOfCost({ name: "Operações" }),
  createMokedCenterOfCost({ name: "RH" }),
];

export class CenterOfCostMockedService extends PllMockedRestService<CenterOfCost> implements CenterOfCostService {

  constructor () {
    super(INITIAL_CENTER_OF_COST_MOCKED_DATA);
  };

  override createRecord = (data: Partial<CenterOfCost>) => createMokedCenterOfCost(data);

  getAllByFilter(params: GetAllCenterOfCostByFilterParams): Observable<PllPaginatedResponse<GetAllCenterOfCostByFilterResponse>> {
    return of(this._filtering(this.records(), params)).pipe(delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 }))).pipe(map(response => ({
      data: response,
      pagination: {
        page: 1,
      },
    })));
  };

  private _filtering(records: CenterOfCost[], params: GetAllCenterOfCostByFilterParams): CenterOfCost[] {
    return records.filter(record => !params.status || params.status === "ALL"? true : params.status === "ACTIVE"? record.active : !record.active);
  };
};