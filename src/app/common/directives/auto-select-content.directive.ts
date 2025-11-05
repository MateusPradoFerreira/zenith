import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[currencyMask][hlmInput], input[type="number"][hlmInput]',
  standalone: true,
})
export class AutoSelectContentDirective {

  constructor (
    private el: ElementRef,
  ) {};

  @HostListener('focus') onFocus() {
    this.el.nativeElement?.select();
  };
};