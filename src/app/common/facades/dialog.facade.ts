import { EventEmitter, inject, Injectable, InputSignal, ModelSignal, OutputEmitterRef, Type } from "@angular/core";
import { DialogContentVariants, HlmDialogOptions, HlmDialogService } from "../libs/ui/ui-dialog-helm/src";
import { ConfirmationComponent } from "../components/confirmation.component";
import { Observable, Subject } from "rxjs";

export type IsInput<T> = T extends InputSignal<any> | ModelSignal<any>? true : false;
export type ExInput<T> = T extends InputSignal<infer V>? V : T;
export type Inputkeys<T> = Partial<{[K in keyof T as IsInput<T[K]> extends true? K : never]: IsInput<T[K]> extends true? ExInput<T[K]> : never}>;
  
export type IsOutput<T> = T extends OutputEmitterRef<any> | EventEmitter<any>? true : false;
export type ExOutput<T> = T extends OutputEmitterRef<infer V> | EventEmitter<infer V>? V : never;
export type Outputkeys<T> = Partial<{[K in keyof T as T[K] extends OutputEmitterRef<any> | EventEmitter<any> ? K : never]: IsOutput<T[K]> extends true? (data: ExOutput<T[K]>) => void : never}>;

export type DialogConfig<TComponent, TContext = any> = HlmDialogOptions<TContext> & {
  inputs?: Inputkeys<TComponent>;
  events?: Outputkeys<TComponent>;
};

@Injectable({ providedIn: "root" })
export class DialogFacade {
  service: HlmDialogService = inject(HlmDialogService);

  open<TComponent = any>(component: Type<any>, { inputs, events, ...config }: DialogConfig<TComponent>) {
    return this.service.open(component, { 
      ...config,
      context: { ...config?.context, inputs, events },
    });
  };

  confirm(config: DialogConfig<ConfirmationComponent>) {
    return this.open<ConfirmationComponent>(ConfirmationComponent, config);
  };

  confirmRequest<T>(observable: Observable<T>, header: string, severity: DialogContentVariants["severity"] = "primary") {
    const sub$ = new Subject<T>();
    this.confirm({ 
      header,
      severity,
      events: {
        onConfirm: () => {
          observable.subscribe({
            next: response => {
              sub$.next(response);
              sub$.complete();
            },
            error: error => {
              sub$.error(error);
              sub$.complete();
            },
          });
        },
        onCancel: () => sub$.complete(),
      },
    }).closed$.subscribe(res => {
      if(!res?.status) sub$.complete();
    });
    return sub$.asObservable();
  };

};