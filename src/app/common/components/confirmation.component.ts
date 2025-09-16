import { Component, inject, input, output } from "@angular/core";
import { GlobalModule } from "../../core/modules/global-module.module";
import { BrnDialogRef, injectBrnDialogContext } from "@spartan-ng/brain/dialog";
import { DialogContentVariants } from "@spartan-ng/ui-dialog-helm";

@Component({
  standalone: true,
  selector: 'app-confirmation',
  imports: [GlobalModule],
  template: `
    <div class="p-2 grid grid-cols-2 gap-x-2.5 min-w-96">
      <button hlmBtn variant="text" (click)="cancel()">Voltar</button>
      <button hlmBtn [severity]="severity()" (click)="confirm()">Confirmar</button>
    <div>
  `,
})
export class ConfirmationComponent {
  private readonly _dialogRef = inject<BrnDialogRef<any>>(BrnDialogRef);

  private readonly _context = injectBrnDialogContext();
  severity = input<DialogContentVariants["severity"]>(this._context?.$severity || "primary");

  onConfirm = output();
  onCancel = output();

  confirm() {
    this.onConfirm.emit();
    this._dialogRef.close({ status: "OK" });
  };

  cancel() {
    this.onCancel.emit();
    this._dialogRef.close({ status: "CANCEL" });
  };
};