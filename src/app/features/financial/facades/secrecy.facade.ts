import { inject, Injectable, Type } from "@angular/core";
import { PllFacade } from "../../../core/lib/pollaris";
import { Secrecy } from "../models/secrecy.model";
import { PllFormSchemaConfig } from "../../../core/lib/pollaris/forms";
import { Validators } from "@angular/forms";
import { Refiners } from "../../../core/lib/pollaris/forms/refiners";
import { GetAllSecrecyByFilterParams, SecrecyService } from "../services/secrecy.service";
import { SecrecyState } from "../states/secrecy.state";
import { SecrecyFormComponent } from "../views/secrecy/secrecy-form/secrecy-form.component";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

export type SecrecyUseQueryParams = GetAllSecrecyByFilterParams;

@Injectable({ providedIn: "root" })
export class SecrecyFacade extends PllFacade<Secrecy, Secrecy, SecrecyUseQueryParams, SecrecyFormComponent> {
  override state = inject(SecrecyState);
  override service = inject(SecrecyService);
  override queryFn = (params: SecrecyUseQueryParams) => this.service.getAllByFilter(params);

  override header: string = "Título";
  override component: Type<any> = SecrecyFormComponent;
  override dialogWidth: DialogContentVariants["width"] = "sm";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<Secrecy> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      active: { value: true },
    },
  };

  override filterSchema: PllFormSchemaConfig<SecrecyUseQueryParams> = {
    fields: {
      status: { value: "ACTIVE" },
    },
  };
};