import { Component, inject, Input } from "@angular/core";
import { GlobalModule } from "../../core/modules/global-module.module";
import { DialogSeverity } from "../facades/dialog.facade";
import { BrnDialogRef } from "@spartan-ng/brain/dialog";

@Component({
  standalone: true,
  selector: 'app-confirmation',
  imports: [GlobalModule],
  template: `
    <div class="px-6 py-4 grid grid-cols-2 gap-2.5">
      <button hlmBtn variant="secondary" (click)="back()">Voltar</button>
      <button hlmBtn [severity]="severity" (click)="confirm()">Confirmar</button>
    <div>
  `,
})
export class ConfirmationComponent {
  private readonly _dialogRef = inject<BrnDialogRef<any>>(BrnDialogRef);

  @Input() severity: DialogSeverity = "primary";

  confirm() {
    this._dialogRef.close({ status: "OK" });
  };

  back() {
    this._dialogRef.close();
  };
}
