import { PllPaginatedResponse, PllRecordId } from "@pollaris";
import moment from "moment";

export class Util {
  static buildMonths(monthDay: number = 1, refence: Date = moment().startOf("year").subtract(6, "months").toDate(), months: number = 24): Date[] {
    const dates: Date[] = [];
    for(let index = 0; index < months; index++) dates.push(moment(refence).startOf("month").add(index, "months").date(monthDay).toDate());
    return dates;
  };

  static getTimedOur(date: Date, time: string): Date {
    if(!time) time = moment().format("HH:mm:ss");
    const mmTime = moment(time, "HH:mm:ss");
    return moment(date)
      .set("hour", mmTime.get("hour"))
      .set("minutes", mmTime.get("minutes"))
      .set("seconds", mmTime.get("seconds"))
      .toDate();
  };

  static paginatedValueFrom<T extends PllRecordId>(data: T[] = []): PllPaginatedResponse<T> {
    return {
      data: data || [],
      pagination: {
        page: 1,
      },
    }
  };
};