import { inject, Injectable, Type } from "@angular/core";
import { HlmDialogOptions, HlmDialogService } from "../libs/ui/ui-dialog-helm/src";
import { DialogComponent } from "../components/dialog.component";
import { hlm } from "@spartan-ng/brain/core";

export type DialogWidth = "95" | "85" | "65" | "55" | "35";

type dialogConfig = Partial<HlmDialogOptions> & {
  context?: Record<any, any>,
  width?: DialogWidth; 
  header?: string;
  blockScrollContent?: boolean;
};

@Injectable({ providedIn: "root" })
export class DialogFacade {

  dialogService: HlmDialogService = inject(HlmDialogService);

  open(component: Type<any>, config: dialogConfig = {}) {
    return this.dialogService.open(DialogComponent, { ...config, context: {
      component,
      context: config?.context || {},
      header: config?.header,
      blockScrollContent: config?.blockScrollContent,
    }, contentClass: hlm(this._getWidthStyle(config?.width), config?.contentClass)});
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

};