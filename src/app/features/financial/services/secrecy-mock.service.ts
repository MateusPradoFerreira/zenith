import { PllMockRestService, PllPaginatedResponse, PllRecordRepository, PllRecordState } from "@pollaris";
import { Secrecy } from "../models/secrecy.model";
import { GetAllSecrecyByFilterParams, GetAllSecrecyByFilterResponse, SecrecyService } from "./secrecy.service";
import { delay, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class SecrecyMockState extends PllRecordState<Secrecy> {};

@Injectable({ providedIn: "root" })
export class SecrecyMockRepository extends PllRecordRepository<Secrecy> {
  override state = inject(SecrecyMockState);
};

@Injectable({ providedIn: "root" })
export class SecrecyMockService extends PllMockRestService<Secrecy> implements SecrecyService {
  override repository = inject(SecrecyMockRepository);

  getAllByFilter(params: GetAllSecrecyByFilterParams): Observable<PllPaginatedResponse<GetAllSecrecyByFilterResponse>> {
    return this.repository.find({
      ...(!params?.status || params.status === "ALL"? {} : { active: params.status === "ACTIVE" }),
    }).pipe(delay(this.delay()));
  };
};