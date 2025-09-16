import type { ComponentType } from '@angular/cdk/portal';
import { Injectable, type TemplateRef, inject } from '@angular/core';
import {
	type BrnDialogOptions,
	BrnDialogService,
	DEFAULT_BRN_DIALOG_OPTIONS,
	cssClassesToArray,
} from '@spartan-ng/brain/dialog';
import { DialogContentVariants, HlmDialogContentComponent } from './hlm-dialog-content.component';
import { hlmDialogOverlayClass } from './hlm-dialog-overlay.directive';
import { Subject } from 'rxjs';

export type HlmDialogOptions<DialogContext = unknown> = Partial<BrnDialogOptions> & {
	contentClass?: string;
	context?: DialogContext;
	header?: string;
  size?: DialogContentVariants["size"];
	severity?: DialogContentVariants["severity"];
  scroll?: DialogContentVariants["scroll"];
	align?: DialogContentVariants["align"];
};

@Injectable({
	providedIn: 'root',
})
export class HlmDialogService {
	private readonly _brnDialogService = inject(BrnDialogService);

	public open(component: ComponentType<unknown> | TemplateRef<unknown>, options?: Partial<HlmDialogOptions>) {
		const mergedOptions = {
			...DEFAULT_BRN_DIALOG_OPTIONS,
			...(options ?? {}),
			backdropClass: cssClassesToArray(`${hlmDialogOverlayClass} ${options?.backdropClass ?? ''}`),
			context: { 
				...(options?.context as Object ?? {}), 
				$component: component, 
				$dynamicComponentClass: options?.contentClass,
				$header: options?.header,
				$severity: options?.severity || "primary",
				$scroll: options?.scroll || true,
				$size: options?.size || "fit",
				$align: options?.align || "center",
			},
		};

		return this._brnDialogService.open(HlmDialogContentComponent, undefined, mergedOptions.context, mergedOptions);
	}
}
