import { PllMockedRestService, PllPaginatedResponse } from "@pollaris";
import { ScheduleCategory } from "../models/schedule-category.model";
import { GetAllScheduleCategoryByFilterParams, ScheduleCategoryService } from "./schedule-category.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';
import { Injectable } from "@angular/core";

export function createMokedScheduleCategory(data: Partial<ScheduleCategory>): ScheduleCategory {
  return new ScheduleCategory({
    name: "New Schedule Category",
    type: "SCHEDULE",
    active: true,
    ...data,
    id: data.id || uuid(),
  });
};

export const INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA: ScheduleCategory[] = [
  createMokedScheduleCategory({ name: "Evento", color: "#615fff" }),
  createMokedScheduleCategory({ name: "Tarefa", color: "#2b7fff" }),
  createMokedScheduleCategory({ name: "Despesa", type: "PAYABLE", color: "#ff2056" }),
  createMokedScheduleCategory({ name: "Receita", type: "RECEIVABLE", color: "#00bc7d" }),
];

@Injectable({ providedIn: "root" })
export class ScheduleCategoryMockedService extends PllMockedRestService<ScheduleCategory> implements ScheduleCategoryService {

  constructor () {
    super(INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA);
  };

  override createRecord = (data: Partial<ScheduleCategory>) => createMokedScheduleCategory(data);

  getAllByFilter(params: GetAllScheduleCategoryByFilterParams): Observable<PllPaginatedResponse<ScheduleCategory>> {
    return of(this._filtering(this.records(), params)).pipe(delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 }))).pipe(map(response => ({
      data: response,
      pagination: {
        page: 1,
      },
    })));
  };

  private _filtering(records: ScheduleCategory[], params: GetAllScheduleCategoryByFilterParams): ScheduleCategory[] {
    const filtered = records.filter(record => !params.status || params.status === "ALL"? true : params.status === "ACTIVE"? record.active : !record.active);
    return filtered.filter(record => !params.type || params.type === "ALL"? true : params.type === record.type);
  };
};