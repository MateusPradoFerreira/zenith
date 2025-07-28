import { Component, OnInit, signal, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { injectBrnDialogContext } from "@spartan-ng/brain/dialog";

@Component({
  standalone: true,
  selector: 'app-dialog',
  template: `
    <ng-template #container></ng-template>
  `,
})
export class DialogComponent implements OnInit {
  private readonly _context = injectBrnDialogContext();

	public readonly component: Type<any> = this._context?.$component;
  public readonly inputs = signal<boolean>(this._context?.inputs || {});
  public readonly events = signal<boolean>(this._context?.events || {});

  @ViewChild("container", { read: ViewContainerRef, static: true }) viewRef!: ViewContainerRef;

  ngOnInit() {
    this.loadComponent();
  };

  loadComponent() {
    const componentRef = this.viewRef.createComponent(this.component);
    Object.entries(this.inputs()).forEach(([prop, value]) => {
      componentRef.setInput(prop, value);
    });
    Object.entries(this.events()).forEach(([prop, value]) => {
      componentRef.instance[prop].subscribe(value);
    });
  };
};