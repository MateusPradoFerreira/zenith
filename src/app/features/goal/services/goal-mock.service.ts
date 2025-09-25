import { PllMockRestService, PllPaginatedResponse } from "@pollaris";
import { Goal } from "../models/goal.model";
import { GetAllGoalByFilterParams, GetAllGoalByFilterResponse, GoalService } from "./goal.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';
import { Util } from "../../../common/util/util";
import { Injectable } from "@angular/core";

export function createMockedGoal(data: Partial<Goal>): Goal {
  return new Goal({
    color: fakerJs.helpers.arrayElement(["SLATE", "ZINC", "STONE", "RED", "ORANGE", "AMBER", "YELLOW", "LIME", "GREEN", "EMERALD", "TEAL", "CYAN", "SKY", "BLUE", "INDIGO", "VIOLET", "PURPLE", "FUCHSIA", "PINK", "ROSE"]),
    duration: fakerJs.number.int({ min: 30, max: 60 }),
    ...data,
    id: data.id || uuid(),
  });
};

export const INITIAL_GOAL_MOCKED_DATA: Goal[] = [
  createMockedGoal({ name: "Caminhada", color: "ROSE" }),
  createMockedGoal({ name: "Estudo Diário", color: "VIOLET" }),
  createMockedGoal({ name: "Leitura", color: "TEAL" }),
  createMockedGoal({ name: "Curso", color: "ORANGE" }),
];

@Injectable({ providedIn: "root" })
export class GoalMockService extends PllMockRestService<Goal> implements GoalService {

  constructor () {
    super(INITIAL_GOAL_MOCKED_DATA);
  };

  override createRecord = (data: Partial<Goal>) => createMockedGoal(data);

  getAllByFilter(params: GetAllGoalByFilterParams): Observable<PllPaginatedResponse<GetAllGoalByFilterResponse>> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
      map(records => records.map(record => {
        const newRecord: GetAllGoalByFilterResponse = {
          ...record,
          status: "30 min para a meta diária",
          score: 4,
        };
        return newRecord;
      })),
      map(response => Util.paginatedValueFrom(response)),
    );
  };

  private _filtering(records: Goal[], params: GetAllGoalByFilterParams): Goal[] {
    return records;
  };
};