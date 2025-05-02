import { Directive, ElementRef, forwardRef, HostListener, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
  selector: '[hlmInputNumber]',
  standalone: true,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HlmInputNumberDirective), multi: true },
  ]
})
export class HlmInputNumberDirective implements ControlValueAccessor {
  @Input() prefix: string = "";
  @Input() suffix: string = "";
  @Input() decimals: number = 2;

  private onChange = (value: number | null) => {};
  private onTouched = () => {};
  private value: number | null = null;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(): void {
    const input = this.el.nativeElement;

    const rawValue = this._clean(input.value);
    const stringValue = String(rawValue).replace(/\D/g, "");
    const value = parseFloat(this._insertDecimal(stringValue, this.decimals));

    this.value = value;
    this.onChange(this.value);

    // Format and update view preserving cursor position
    const formatted = this.value !== null? this._format(this.value) : '';
    const addedChars = formatted.length - rawValue.length;
    const cursorStart = input.selectionStart ?? rawValue.length;

    input.value = formatted;

    const newCursorPos = Math.max(cursorStart + addedChars, 0);
    setTimeout(() => input.setSelectionRange(newCursorPos, newCursorPos));

  };

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
    this._updateView();
  }

  writeValue(value: number | null): void {
    this.value = value;
    this._updateView();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  private _format(value: number): string {
    const formatted = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: this.decimals, maximumFractionDigits: this.decimals }).format(value);
    return this.prefix + formatted + this.suffix;
  };

  private _updateView(): void {
    const input = this.el.nativeElement;
    input.value = this.value !== null ? this._format(this.value) : "";
  };
  
  private _insertDecimal(value: string, decimals: number): string {
    if (!value) return "0,00";
    const padded = value.padStart(decimals + 1, "0");
    const intPart = padded.slice(0, padded.length - decimals);
    const decimalPart = padded.slice(-decimals);
    return decimals > 0 ? `${intPart}.${decimalPart}` : intPart;
  };

  private _clean(value: string): string {
    const pattern = new RegExp(`[${this._escapeRegex(this.prefix)}${this._escapeRegex(this.suffix)}\\s]`, 'g');
    return value.replace(pattern, '');
  };

  private _escapeRegex(value: string): string {
    return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

}