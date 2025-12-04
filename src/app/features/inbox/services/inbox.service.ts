import { PllID, PllPaginatedResponse, PllRestService } from "@pollaris";
import { Inbox, InboxPriority, InboxStatus } from "../models/inbox.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import moment from "moment";
import { Injectable } from "@angular/core";

export type InboxViewParams = {
  status?: InboxStatus | "TOMAKE" | "ALL";
  priority?: InboxPriority | "ALL";
  startsAt: Date;
  endsAt: Date;
};

@Injectable()
export class InboxService extends PllRestService<Inbox> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "inbox";

  getAllByFilter({ startsAt, endsAt, ...params }: InboxViewParams): Observable<PllPaginatedResponse<Inbox>> {
    return this.http.get<PllPaginatedResponse<Inbox>>(`${this.baseRoute}/${this.pathRoute}/startsAt/${moment(startsAt).format("YYYY-MM-DD")}/endsAt/${moment(endsAt).format("YYYY-MM-DD")}`, { params });
  };

  process(id: PllID): Observable<Inbox> {
    return this.http.post<Inbox>(`${this.baseRoute}/${this.pathRoute}/${id}/process`, {});
  };

  cancel(id: PllID): Observable<Inbox> {
    return this.http.post<Inbox>(`${this.baseRoute}/${this.pathRoute}/${id}/cancel`, {});
  };

  reopen(id: PllID): Observable<Inbox> {
    return this.http.post<Inbox>(`${this.baseRoute}/${this.pathRoute}/${id}/reopen`, {});
  };
};