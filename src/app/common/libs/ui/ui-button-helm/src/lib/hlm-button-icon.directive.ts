import { ComponentRef, Directive, Injector, Input, OnChanges, ViewContainerRef } from "@angular/core";
import { LucideAngularComponent } from "lucide-angular";

@Directive({
	standalone: true,
  selector: "[hlmBtnIcon]",
	exportAs: "hlmBtnIcon",
})
export class HlmButtonIconDirective implements OnChanges {
  @Input() hlmBtnIcon: string = ""; 
  @Input() hlmBtnIconPosition: "start" | "end" = "start";
  @Input() hlmBtnLoading: boolean = false;
  @Input() size: "default" | "icon" = "default";

  private componentRef?: ComponentRef<LucideAngularComponent>;

  constructor(private vcRef: ViewContainerRef, private injector: Injector) {};

  ngOnChanges() {
    this.createIcon();
  };

  private createIcon() {
    if(!this.componentRef) this.componentRef = this.vcRef.createComponent(LucideAngularComponent, { injector: this.injector });
    this.componentRef.setInput("name", this.hlmBtnLoading? "loader-circle" : this.hlmBtnIcon);
    this.componentRef.setInput("class", (this.size !== "icon"? (this.hlmBtnIconPosition === "start"? "-ml-2 " : "-mr-2 ") : "") + (this.hlmBtnLoading? "animate-spin" : ""));
    const nativeEl = this.vcRef.element.nativeElement;
    const iconEl = this.componentRef.location.nativeElement;
    this.hlmBtnIconPosition === "start"? nativeEl.insertBefore(iconEl, nativeEl.firstChild) : nativeEl.appendChild(iconEl);
  };

}