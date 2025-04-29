import { Component, OnInit, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { injectBrnDialogContext } from "@spartan-ng/brain/dialog";
import { NgIf } from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-dialog',
  imports: [NgIf],
  template: `
    <div class="grid grid-cols-1 {{ header? 'grid-rows-[48px_1fr]' : 'grid-rows-1' }} max-h-[95vh]">
      <div *ngIf="header" class="text-xl flex items-center px-6 border-b border-slate-200">{{header}}</div>
      <div class="{{ blockScrollContent? 'overflow-hidden' : 'overflow-y-auto' }}"> 
        <ng-template #container></ng-template>
      </div>
    <div>
  `,
})
export class DialogComponent implements OnInit {
  component: Type<any>;
  context: any = {};
  header: string = "";
  blockScrollContent: boolean = false;

  private readonly _dialogContext = injectBrnDialogContext<{ component: Type<any>, context?: Record<any, any>, header?: string, blockScrollContent?: boolean }>();
  @ViewChild("container", { read: ViewContainerRef, static: true }) viewRef!: ViewContainerRef;

  ngOnInit() {
    this.loadContext();
    this.loadComponent();
  };

  loadComponent() {
    const componentRef = this.viewRef.createComponent(this.component);
    Object.keys(this.context).forEach(prop => {
      componentRef.instance[prop] = this.context[prop];
    });
  };

  loadContext() {
    this.component = this._dialogContext.component;
    this.context = this._dialogContext.context || {};
    this.header = this._dialogContext.header || "";
    this.blockScrollContent = this._dialogContext.blockScrollContent || false;
    console.log("DIALOG-PROPS", this.context);
  };
  
}
