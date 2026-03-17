import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
	booleanAttribute,
	computed,
	inject,
	input,
} from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { BrnColumnDefComponent } from '@spartan-ng/brain/table';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-td',
	imports: [NgTemplateOutlet],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-template #content>
			<ng-content />
		</ng-template>
		@if (truncate()) {
			<span [class]="_computedTruncateClass()">
				<ng-container [ngTemplateOutlet]="content" />
			</span>
		} @else {
			<ng-container [ngTemplateOutlet]="content" />
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmTdComponent {
	private readonly _columnDef? = inject(BrnColumnDefComponent, { optional: true });
	public readonly truncate = input(true, { transform: booleanAttribute });

	public readonly truncateClass = input<ClassValue>('', { alias: 'truncateClass' });
	protected readonly _computedTruncateClass = computed(() =>
		hlm(
			'flex-1 truncate', 
			this.truncateClass(),
		),
	);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'flex text-[13px] border-l border-slate-200/70 flex-none px-4 py-2 items-center [&:has([role=checkbox])]:pr-0', 
			this._columnDef?.class(), 
			this.userClass(),
			this.truncate? 'overflow-hidden' : '',
		),
	);
}
