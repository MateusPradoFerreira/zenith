import { EventEmitter, inject, Injectable, InputSignal, ModelSignal, OutputEmitterRef, Type } from "@angular/core";
import { HlmDialogOptions, HlmDialogService } from "../libs/ui/ui-dialog-helm/src";
import { DialogComponent } from "../components/dialog.component";
import { hlm } from "@spartan-ng/brain/core";
import { ConfirmationComponent } from "../components/confirmation.component";

export type DialogWidth = "95" | "85" | "65" | "55" | "35" | "fit";
export type DialogSeverity = "primary" | "danger" | "warn" | "success" | "info" | "help";

export type IsInput<T> = T extends InputSignal<any> | ModelSignal<any>? true : false;
export type ExInput<T> = T extends InputSignal<infer V>? V : T;
export type Inputkeys<T> = Partial<{[K in keyof T as IsInput<T[K]> extends true? K : never]: IsInput<T[K]> extends true? ExInput<T[K]> : never}>;
  
export type IsOutput<T> = T extends OutputEmitterRef<any> | EventEmitter<any>? true : false;
export type ExOutput<T> = T extends OutputEmitterRef<infer V> | EventEmitter<infer V>? V : never;
export type Outputkeys<T> = Partial<{[K in keyof T as T[K] extends OutputEmitterRef<any> | EventEmitter<any> ? K : never]: IsOutput<T[K]> extends true? (data: ExOutput<T[K]>) => void : never}>;

export type DialogConfig<TComponent> = {
  header?: string;
  width?: DialogWidth;
  severity?: DialogSeverity;
  inputs?: Inputkeys<TComponent>;
  events?: Outputkeys<TComponent>;
  scroll?: boolean;
  contentClass?: string;
};

export type DialogConfirmConfig = {
  header: string;
  width?: DialogWidth;
  severity?: DialogSeverity;
  onConfirm?: () => void;
  onCancel?: () => void;
};

@Injectable({ providedIn: "root" })
export class DialogFacade {

  dialogService: HlmDialogService = inject(HlmDialogService);

  open<TComponent = any>(component: Type<any>, { inputs = {}, events = {}, header, scroll = true, width, contentClass, severity }: DialogConfig<TComponent> = {}) {
    return this.dialogService.open(DialogComponent, { 
      context: { component, inputs, events, header, scroll, severity },
      contentClass: hlm(this._getWidthStyle(width), contentClass),
    });
  };

  private _getWidthStyle(width?: DialogWidth): string {
    switch (width) {
      case ("35"): return "w-[35vw]";
      case ("55"): return "w-[55vw]";
      case ("65"): return "w-[65vw]";
      case ("85"): return "w-[85vw]";
      case ("95"): return "w-[95vw]";
      case ("fit"): return "w-fit";
      default: return "w-[95vw]";
    };
  };

  confirm({ header, width = "fit", severity, onConfirm = () => {}, onCancel = () => {}}: DialogConfirmConfig) {
    return this.open<ConfirmationComponent>(ConfirmationComponent, { header, width, severity, inputs: { severity }, events: { onConfirm, onCancel } });
  };

};