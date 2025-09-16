import { PllMockRestService, PllPaginatedResponse } from "@pollaris";
import { GoalItem } from "../models/goal-item.model";
import { GetAllGoalItemByFilterParams, GetAllGoalItemByFilterResponse, GoalItemService } from "./goal-item.service";
import { delay, map, Observable, of } from "rxjs";
import { fakerJs } from "../../../core/config/faker.config";
import { v4 as uuid } from 'uuid';
import moment from "moment";
import { INITIAL_GOAL_MOCKED_DATA } from "./goal-mock.service";
import { Util } from "../../../common/util/util";

export function createMockedGoalItem(data: Partial<GoalItem>): GoalItem {
  return new GoalItem({
    startsAt: moment().toDate(),
    startsAtTime: "08:00:00",
    duration: fakerJs.number.int({ min: 30, max: 60 }),
    ...data,
    id: data.id || uuid(),
  });
};

export const INITIAL_GOAL_ITEM_MOCKED_DATA: GoalItem[] = [
  createMockedGoalItem({ goalId: INITIAL_GOAL_MOCKED_DATA[0].id }),
  createMockedGoalItem({ goalId: INITIAL_GOAL_MOCKED_DATA[0].id }),
  createMockedGoalItem({ goalId: INITIAL_GOAL_MOCKED_DATA[0].id }),
  createMockedGoalItem({ goalId: INITIAL_GOAL_MOCKED_DATA[0].id }),
];

export class GoalItemMockService extends PllMockRestService<GoalItem> implements GoalItemService {

  constructor () {
    super(INITIAL_GOAL_ITEM_MOCKED_DATA);
  };

  override createRecord = (data: Partial<GoalItem>) => createMockedGoalItem(data);

  getAllByFilter(params: GetAllGoalItemByFilterParams): Observable<PllPaginatedResponse<GetAllGoalItemByFilterResponse>> {
    return of(this._filtering(this.records(), params)).pipe(
      delay(fakerJs.helpers.rangeToNumber({ min: 100, max: 500 })),
      map(response => Util.paginatedValueFrom(response)),
    );
  };

  private _filtering(records: GoalItem[], params: GetAllGoalItemByFilterParams): GoalItem[] {
    return records.filter(record => record.goalId === params.goalId);
  };
};