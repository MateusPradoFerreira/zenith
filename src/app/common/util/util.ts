import moment from "moment";

export class Util {
  static buildMonths(refence: Date = moment().startOf("year").subtract("months", 6).toDate(), months: number = 24): Date[] {
    const dates: Date[] = [];
    for(let index = 0; index < months; index++) dates.push(moment(refence).startOf("month").add("months", index).toDate());
    return dates;
  };
};