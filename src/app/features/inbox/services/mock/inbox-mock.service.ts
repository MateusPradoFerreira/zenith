import { PllID, PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { Inbox, InboxStatus } from "../../models/inbox.model";
import { GetAllInboxByFilterParams, InboxService } from "../inbox.service";
import { delay, map, Observable, switchMap } from "rxjs";
import { inject, Injectable } from "@angular/core";
import moment from "moment";
import { event, EventObs } from "../../../../common/directives/base-form-component.directive";

@Injectable({ providedIn: "root" })
export class InboxMockState extends PllRecordState<Inbox> {};

@Injectable({ providedIn: "root" })
export class InboxMockRepository extends PllRecordRepository<Inbox> {
  override state = inject(InboxMockState);
};

export class InboxMockService extends PllMockRestService<Inbox> implements InboxService {
  override repository = inject(InboxMockRepository);

  protected override $evGet: EventObs<Inbox, Inbox> = event(map(record => ({ ...record, status: this._transformStatus(record) })));

  getAllByFilter(params: GetAllInboxByFilterParams): Observable<PllPaginatedResponse<Inbox>> {
    const tomorrow = moment().add(1, "day").toDate();
    return this.repository.find({
      priority: !params.priority || params.priority === "ALL"? undefined : params.priority,
      /* $or: [
        { status: "PROCESSED", processedAt: { $gte: params.startsAt, $lte: params.endsAt } },
        { status: "CANCELLED", cancelledAt: { $gte: params.startsAt, $lte: params.endsAt } },
        { status: { $in: ["PENDING", "OVERDUE"] as any }, createdAt: { $gte: params.startsAt, $lte: params.endsAt } },
      ], */
      ...(params?.status === "PROCESSED"? { processedAt: { $ne: null } } : {}),
      ...(params?.status === "CANCELLED"? { cancelledAt: { $ne: null } } : {}),
      ...(params?.status === "PENDING"? { processedAt: { $eq: null }, cancelledAt: { $eq: null }, dueAt: { $gte: tomorrow } } : {}),
      ...(params?.status === "OVERDUE"? { processedAt: { $eq: null }, cancelledAt: { $eq: null }, dueAt: { $lt: tomorrow } } : {}),
      ...(params?.status === "TOMAKE"? { processedAt: { $eq: null }, cancelledAt: { $eq: null } } : {}),
    }).pipe(
      delay(this.delay()),
      map(response => ({ ...response, data: this.merge<Inbox, Inbox>(response.data, record => ({
        status: this._transformStatus(record),
      }))})),
    );
  };

  process(id: PllID): Observable<Inbox> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, processedAt: new Date() })));
  };

  cancel(id: PllID): Observable<Inbox> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, cancelledAt: new Date(), processedAt: null })));
  };

  reopen(id: PllID): Observable<Inbox> {
    return this.get(id).pipe(switchMap(response => this.put({ ...response, cancelledAt: null, processedAt: null })));
  };

  private _transformStatus(record: Inbox): InboxStatus {
    if(record.processedAt) return "PROCESSED";
    if(record.cancelledAt) return "CANCELLED";
    return moment().subtract(1, "day").isBefore(record.dueAt, "D")? "PENDING" : "OVERDUE";
  };
};