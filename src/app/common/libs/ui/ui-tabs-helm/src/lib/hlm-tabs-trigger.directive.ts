import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnTabsTriggerDirective } from '@spartan-ng/brain/tabs';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmTabsTrigger]',
	standalone: true,
	hostDirectives: [{ directive: BrnTabsTriggerDirective, inputs: ['brnTabsTrigger: hlmTabsTrigger', 'disabled'] }],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmTabsTriggerDirective {
	public readonly triggerFor = input.required<string>({ alias: 'hlmTabsTrigger' });

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'inline-flex cursor-pointer duration-300 border-b-2 border-transparent items-center justify-center whitespace-nowrap rounded-t-sm px-4 h-full text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50  data-[state=active]:text-violet-500 data-[state=active]:border-violet-300 mb-[-1px]',
			this.userClass(),
		),
	);
}
