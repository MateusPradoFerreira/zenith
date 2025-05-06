import { inject, Injectable, Type } from "@angular/core";
import { HlmDialogOptions, HlmDialogService } from "../libs/ui/ui-dialog-helm/src";
import { DialogComponent } from "../components/dialog.component";
import { hlm } from "@spartan-ng/brain/core";
import { ConfirmationComponent } from "../components/confirmation.component";

export type DialogWidth = "95" | "85" | "65" | "55" | "35";
export type DialogSeverity = "primary" | "danger" | "warn" | "success" | "info" | "help";

type dialogConfig = Partial<HlmDialogOptions> & {
  context?: Record<any, any>,
  width?: DialogWidth; 
  severity?: DialogSeverity; 
  header?: string;
  blockScrollContent?: boolean;
};

type dialogConfirmConfig = {
  header: string;
  width?: DialogWidth;
  severity?: DialogSeverity;
  onConfirm?: () => void;
  onCancel?: () => void;
};

@Injectable({ providedIn: "root" })
export class DialogFacade {

  dialogService: HlmDialogService = inject(HlmDialogService);

  open(component: Type<any>, { context = {}, header, blockScrollContent, width, severity, ...config }: dialogConfig = {}) {
    return this.dialogService.open(DialogComponent, { ...config, context: {
      component,
      context,
      header,
      blockScrollContent,
      severity,
    }, contentClass: hlm(this._getWidthStyle(width), config?.contentClass)});
  };

  private _getWidthStyle(width?: DialogWidth): string {
    switch (width) {
      case ("35"): return "w-[35vw]";
      case ("55"): return "w-[55vw]";
      case ("65"): return "w-[65vw]";
      case ("85"): return "w-[85vw]";
      case ("95"): return "w-[95vw]";
      default: return "w-[95vw]";
    };
  };

  confirm({ header, width = "35", severity, onConfirm = () => {}, onCancel = () => {}}: dialogConfirmConfig) {
    this.open(ConfirmationComponent, { 
      header,
      width,
      severity,
      context: { severity },
    }).closed$.subscribe(res => {
      res?.status === "OK"? onConfirm() : onCancel();
    });
  };

};