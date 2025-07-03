import { Component, computed, input, InputSignal, isSignal, OnInit, signal, Type, ViewChild, ViewContainerRef } from "@angular/core";
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
        success: "[&>h1]:text-white [&>h1]:bg-emerald-500",
        info: "[&>h1]:text-white [&>h1]:bg-blue-500",
        warn: "[&>h1]:text-white [&>h1]:bg-amber-500",
        help: "[&>h1]:text-white [&>h1]:bg-violet-500",
        danger: "[&>h1]:text-white [&>h1]:bg-rose-500",
      },
      scroll: {
        true: "[&_]:overflow-y-auto",
        false: "[&_]:overflow-hidden",
      },
    },
    defaultVariants: {
      severity: "primary",
      scroll: true,
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
      <h1 *ngIf="header()" class="text-lg flex items-center px-6 border-b border-slate-200">{{header()}}</h1>
      <main>
        <ng-template #container></ng-template>
      </main>
    <div>
  `,
})
export class DialogComponent implements OnInit {
  protected readonly _computedClass = computed(() =>
    hlm(dialogVariants({ severity: this.severity(), scroll: this.scroll() }), this.header() && "grid-rows-[48px_1fr]"),
  );

  private readonly _context = injectBrnDialogContext();

  public readonly header = signal<string>(this._context?.header || "");
  public readonly severity = signal<DialogVariants["severity"]>(this._context?.severity || "primary");
  public readonly component = signal<Type<any>>(this._context?.component || null);
  public readonly scroll = signal<DialogVariants["scroll"]>(this._context?.scroll || true);
  public readonly inputs = signal<boolean>(this._context?.inputs || {});
  public readonly events = signal<boolean>(this._context?.events || {});

  @ViewChild("container", { read: ViewContainerRef, static: true }) viewRef!: ViewContainerRef;

  ngOnInit() {
    this.loadComponent();
  };

  loadComponent() {
    const componentRef = this.viewRef.createComponent(this.component());
    Object.entries(this.inputs()).forEach(([prop, value]) => {
      componentRef.setInput(prop, value);
    });
    Object.entries(this.events()).forEach(([prop, value]) => {
      componentRef.instance[prop].subscribe(value);
    });
  };
  
};