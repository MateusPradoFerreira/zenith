import { PllMockedRestService, PllPaginatedResponse } from "@pollaris";
import { ScheduleCategory } from "../models/schedule-category.model";
import { GetAllScheduleCategoryByFilterParams, ScheduleCategoryService } from "./schedule-category.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';
import { Injectable } from "@angular/core";

export function createMockedScheduleCategory(data: Partial<ScheduleCategory>): ScheduleCategory {
  return new ScheduleCategory({
    name: "New Schedule Category",
    active: true,
    ...data,
    id: data.id || uuid(),
  });
};

export const INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA: ScheduleCategory[] = [
  createMockedScheduleCategory({ name: "Reunião", color: "TEAL" }),
  createMockedScheduleCategory({ name: "Tarefa", color: "VIOLET" }),
  createMockedScheduleCategory({ name: "Evento", color: "BLUE" }),
  createMockedScheduleCategory({ name: "Despesa", color: "ROSE" }),
  createMockedScheduleCategory({ name: "Receita", color: "EMERALD" }),
];

@Injectable({ providedIn: "root" })
export class ScheduleCategoryMockedService extends PllMockedRestService<ScheduleCategory> implements ScheduleCategoryService {

  constructor () {
    super(INITIAL_SCHEDULE_CATEGORY_MOCKED_DATA);
  };

  override createRecord = (data: Partial<ScheduleCategory>) => createMockedScheduleCategory(data);

  getAllByFilter(params: GetAllScheduleCategoryByFilterParams): Observable<PllPaginatedResponse<ScheduleCategory>> {
    return of(this._filtering(this.records(), params)).pipe(delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 }))).pipe(map(response => ({
      data: response,
      pagination: {
        page: 1,
      },
    })));
  };

  private _filtering(records: ScheduleCategory[], params: GetAllScheduleCategoryByFilterParams): ScheduleCategory[] {
    return records.filter(record => !params.status || params.status === "ALL"? true : params.status === "ACTIVE"? record.active : !record.active);
  };
};