import moment from "moment";

export class Util {
  static buildMonths(refence: Date = moment().startOf("year").subtract("months", 6).toDate(), months: number = 24): Date[] {
    const dates: Date[] = [];
    for(let index = 0; index < months; index++) dates.push(moment(refence).startOf("month").add("months", index).toDate());
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
};