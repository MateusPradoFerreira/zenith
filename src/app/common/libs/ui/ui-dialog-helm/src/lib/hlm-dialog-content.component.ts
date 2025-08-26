import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/brain/core';
import { BrnDialogCloseDirective, BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';
import { HlmDialogCloseDirective } from './hlm-dialog-close.directive';
import { cva, VariantProps } from 'class-variance-authority';

export const dialogContentVariants = cva(
	"grid grid-cols-1 grid-rows-1 max-w-[95vw] max-h-[95vh] 2xl:max-w-[1440px] overflow-hidden border-zinc-200 grid absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border bg-background shadow-lg [animation-duration:200] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] sm:rounded-lg",
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
			width: {
				lg: "w-[1440px]",
				md: "w-[956px]",
				sm: "w-[756px]",
				fit: "w-auto",
			},
		},
		defaultVariants: {
			severity: "primary", 
			scroll: true,
		},
	},
);
export type DialogContentVariants = VariantProps<typeof dialogContentVariants>;

@Component({
	selector: 'hlm-dialog-content',
	imports: [NgIf, BrnDialogCloseDirective, HlmDialogCloseDirective, NgIcon, HlmIconDirective],
	providers: [provideIcons({ lucideX })],
	host: {
		'[class]': '_computedClass()',
		'[attr.data-state]': 'state()',
	},
	template: `
		<header *ngIf="header" class="flex items-center px-6 border-b border-slate-200">
    	<h1 class="text-lg font-medium">{{header}}</h1>
		</header>

		<main>
			<ng-template #container></ng-template>
		</main>

		<button brnDialogClose hlm class="cursor-pointer">
			<span class="sr-only">Close</span>
			<ng-icon hlm size="sm" name="lucideX" />
		</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmDialogContentComponent implements OnInit {
	private readonly _dialogRef = inject(BrnDialogRef);
	private readonly _dialogContext = injectBrnDialogContext({ optional: true });

	public readonly state = computed(() => this._dialogRef?.state() ?? 'closed');

	public readonly component = this._dialogContext?.$component;
	private readonly _dynamicComponentClass = this._dialogContext?.$dynamicComponentClass;
	
	public readonly header = this._dialogContext?.$header;
	public readonly severity: DialogContentVariants["severity"] = this._dialogContext?.$severity;
	public readonly scroll: DialogContentVariants["scroll"] = this._dialogContext?.$scroll;
	public readonly width: DialogContentVariants["width"] = this._dialogContext?.$width;

	public readonly inputs = this._dialogContext?.inputs || {};
  public readonly events = this._dialogContext?.events || {};

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			dialogContentVariants({ scroll: this.scroll, severity: this.severity, width: this.width }),
			this.header && "grid-rows-[48px_1fr]",
			this.userClass(),
			this._dynamicComponentClass,
		),
	);

  @ViewChild("container", { read: ViewContainerRef, static: true }) viewRef!: ViewContainerRef;

	ngOnInit(): void {
		const componentRef: any = this.viewRef.createComponent(this.component);
    Object.entries(this.inputs).forEach(([prop, value]) => {
      if(prop in componentRef.instance) componentRef.setInput(prop, value);
    });
    Object.entries(this.events).forEach(([prop, value]) => {
      componentRef.instance[prop].subscribe(value);
    });
	};
}
