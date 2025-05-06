import { Component, computed, input, OnInit, signal, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { injectBrnDialogContext } from "@spartan-ng/brain/dialog";
import { NgIf } from "@angular/common";
import { cva, VariantProps } from "class-variance-authority";
import { hlm } from "@spartan-ng/brain/core";

export const dialogVariants = cva(
  "max-h-[95vh] grid grid-cols-1 grid-rows-1",
  {
    variants: {
      severity: {
        primary: "",
        success: "[&>h1]:text-emerald-500",
        info: "[&>h1]:text-blue-500",
        warn: "[&>h1]:text-amber-500",
        help: "[&>h1]:text-violet-500",
        danger: "[&>h1]:text-rose-500",
      },
    },
    defaultVariants: {
      severity: "primary",
    },
  },
);
export type DialogVariants = VariantProps<typeof dialogVariants>;

@Component({
  standalone: true,
  selector: 'app-dialog',
  imports: [NgIf],
  template: `
    <div [class]="_computedClass()">
      <h1 *ngIf="header()" class="text-xl flex items-center px-6 border-b border-slate-200">{{header()}}</h1>
      <div class="{{ blockScrollContent? 'overflow-hidden' : 'overflow-y-auto' }}"> 
        <ng-template #container></ng-template>
      </div>
    <div>
  `,
})
export class DialogComponent implements OnInit {
  public readonly component = signal<Type<any>>(null);
  public readonly context = signal<Record<any, any>>({});

  public readonly header = signal<string>("");
  public readonly severity = signal<DialogVariants["severity"]>("primary");
  public readonly blockScrollContent = signal<boolean>(false);

  protected readonly _computedClass = computed(() =>
    hlm(dialogVariants({ severity: this.severity() }), this.header() && "grid-rows-[48px_1fr]"),
  );

  private readonly _dialogContext = injectBrnDialogContext<any>();
  @ViewChild("container", { read: ViewContainerRef, static: true }) viewRef!: ViewContainerRef;

  ngOnInit() {
    this.loadContext();
    this.loadComponent();
  };

  loadComponent() {
    const componentRef = this.viewRef.createComponent(this.component());
    Object.keys(this.context()).forEach(prop => componentRef.instance[prop] = this.context()[prop]);
  };

  loadContext() {
    console.log("DIALOG-PROPS", this._dialogContext);
    if("component" in this._dialogContext) this.component.set(this._dialogContext.component);
    if("context" in this._dialogContext) this.context.set(this._dialogContext.context);
    if("header" in this._dialogContext) this.header.set(this._dialogContext.header);
    if("blockScrollContent" in this._dialogContext) this.blockScrollContent.set(this._dialogContext.blockScrollContent);
    if("severity" in this._dialogContext) this.severity.set(this._dialogContext.severity);
    console.log("DIALOG-PROPS", this.context());
  };
  
}
