import moment from "moment";
import { PllFormStarter } from ".";

export class DateStarter extends PllFormStarter<Date, any> {
  override transform(date: Date): Date {
    if(!date) return date;
    return moment(date).toDate();
  };
};

export class Starters {
  static toDate = new DateStarter();
};