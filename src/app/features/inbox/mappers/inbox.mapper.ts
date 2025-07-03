import { Injectable } from "@angular/core";
import { PllRecordMapper } from "@pollaris";
import { Inbox } from "../models/inbox.model";

@Injectable({ providedIn: "root" })
export class InboxMapper extends PllRecordMapper<Inbox> {
  override to(data: Inbox): Inbox {
    return data;
  };

  override from(data: Inbox): Inbox {
    return data;
  };
};