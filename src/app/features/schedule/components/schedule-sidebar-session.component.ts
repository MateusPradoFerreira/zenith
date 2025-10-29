import { AfterContentInit, Component, ContentChild, ContentChildren, input, model, QueryList, TemplateRef } from "@angular/core";
import { GlobalModule } from "../../../core/modules/global-module.module";
import { HlmTemplateDirective } from "../../../common/directives/hlm-template.directive";

@Component({
  standalone: true,
  selector: 'app-schedule-sidebar-session',
  imports: [GlobalModule],
  template: `
    <div class="px-4 py-3 flex items-center justify-between border-t group">
      <h2 class="font-medium">{{ label() }}</h2>
      <div class="flex items-center gap-0.5">
        <ng-container *ngIf="actionsTemplate" [ngTemplateOutlet]="actionsTemplate"></ng-container>
        <button hlmBtn [icon]="opened()? 'chevron-down' : 'chevron-right'" variant="ghost" size="icon-sm" (click)="handleToggleOpend()"></button>
      </div>
    </div>
    <ng-content *ngIf="opened()" />
  `,
})
export class ScheduleSidebarSessionComponent implements AfterContentInit {
  label = input.required<string>();
  opened = model<boolean>(false);

  @ContentChildren(HlmTemplateDirective) templates!: QueryList<HlmTemplateDirective>;
  @ContentChild("actions", { static: true }) actionsTemplate: TemplateRef<any>;

  handleToggleOpend() {
    this.opened.set(!this.opened());
  };

  ngAfterContentInit() {
    for(let ngTemplate of this.templates) {
      if (ngTemplate.name === "actions") this.actionsTemplate = ngTemplate.template;
    };
  };
};