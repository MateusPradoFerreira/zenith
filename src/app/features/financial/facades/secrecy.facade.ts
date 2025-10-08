import { inject, Injectable, Type } from "@angular/core";
import { PllFacade, PllQueryFacade } from "@pollaris";
import { Secrecy } from "../models/secrecy.model";
import { PllFormSchemaConfig } from "@pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "@pollaris/forms/refiners";
import { GetAllSecrecyByFilterParams, SecrecyService } from "../services/secrecy.service";
import { SecrecyState } from "../states/secrecy.state";
import { SecrecyFormComponent } from "../views/secrecy/secrecy-form/secrecy-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type SecrecyUseQueryParams = GetAllSecrecyByFilterParams;
export type SecrecyUseQueryResponse = Secrecy;

@Injectable({ providedIn: "root" })
export class SecrecyFacade extends PllFacade<Secrecy, SecrecyFormComponent> {
  override state = inject(SecrecyState);
  override service = inject(SecrecyService);

  override header: string = "Título";
  override component: Type<any> = SecrecyFormComponent;
  override dialogSize: DialogContentVariants["size"] = "md";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<Secrecy> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      active: { value: true },
    },
  };
};

@Injectable({ providedIn: "root" })
export class SecrecyQueryFacade extends PllQueryFacade<SecrecyUseQueryResponse, SecrecyUseQueryParams> {
  override service = inject(SecrecyService);
  override queryFn = (params: SecrecyUseQueryParams) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<SecrecyUseQueryParams> = {
    fields: {
      status: { value: "ACTIVE" },
    },
  };
};