import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: "[hlmTemplate]",
})
export class HlmTemplateDirective {
  @Input("hlmTemplate") name!: string;
  constructor(public template: TemplateRef<any>) {}
};