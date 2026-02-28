import { Component, computed, input } from '@angular/core';
import { BrnTabsDirective } from '@spartan-ng/brain/tabs';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-tabs',
	standalone: true,
	hostDirectives: [
		{
			directive: BrnTabsDirective,
			inputs: ['orientation', 'direction', 'activationMode', 'brnTabs: tab'],
			outputs: ['tabActivated'],
		},
	],
	host: {
		'[class]': '_computedClass()',
		role: 'div',
	},
	template: '<ng-content/>',
})
export class HlmTabsComponent {
	public readonly tab = input.required<string>();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly ngClass = input<any>('', { alias: 'ngClass' });
	protected _computedClass = computed(() =>
		hlm(
			'block grid grid-cols-1 grid-rows-[auto_1fr]',
			this.userClass(),
		),
	);
}
