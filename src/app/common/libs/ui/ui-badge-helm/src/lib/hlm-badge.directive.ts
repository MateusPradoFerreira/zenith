import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const badgeVariants = cva(
	'inline-flex items-center border rounded-full px-2.5 py-0.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default: "bg-zinc-900 text-white hover:bg-zinc-800",
				outline: "border-zinc-900 bg-transparent hover:bg-zinc-900 hover:text-white",
				secondary: "bg-slate-100 hover:bg-slate-200/70 border-transparent",
				ghost: "hover:bg-slate-200/70",
			},
			severity: {
				primary: "bg-zinc-900 text-white hover:bg-zinc-800",
				success: "bg-emerald-500 text-white hover:bg-emerald-800",
				info: "bg-blue-500 text-white hover:bg-blue-800",
				warn: "bg-amber-500 text-white hover:bg-amber-800",
				help: "bg-violet-500 text-white hover:bg-violet-800",
				danger: "bg-rose-500 text-white hover:bg-rose-800",
			},
			size: {
				default: 'text-sm',
				lg: 'text-sm',
			},
		},
		defaultVariants: {
			variant: "default",
			severity: "primary",
			size: "default",
		},
		compoundVariants: [
			{ variant: "outline", severity: "primary", class: "text-zinc-900 border-zinc-900 bg-transparent hover:bg-zinc-900 hover:text-white" },
			{ variant: "outline", severity: "success", class: "text-emerald-500 border-emerald-500 bg-transparent hover:bg-emerald-500 hover:text-white" },
			{ variant: "outline", severity: "info", class: "text-blue-500 border-blue-500 bg-transparent hover:bg-blue-500 hover:text-white" },
			{ variant: "outline", severity: "warn", class: "text-amber-500 border-amber-500 bg-transparent hover:bg-amber-500 hover:text-white" },
			{ variant: "outline", severity: "help", class: "text-violet-500 border-violet-500 bg-transparent hover:bg-violet-500 hover:text-white" },
			{ variant: "outline", severity: "danger", class: "text-rose-500 border-rose-500 bg-transparent hover:bg-rose-500 hover:text-white" },
			
			{ variant: "secondary", severity: "primary", class: "text-zinc-900 bg-slate-100 hover:bg-slate-200/70" },
			{ variant: "secondary", severity: "success", class: "text-emerald-600 bg-emerald-100 hover:bg-emerald-200/70" },
			{ variant: "secondary", severity: "info", class: "text-blue-600 bg-blue-100 hover:bg-blue-200/70" },
			{ variant: "secondary", severity: "warn", class: "text-amber-600 bg-amber-100 hover:bg-amber-200/70" },
			{ variant: "secondary", severity: "help", class: "text-violet-600 bg-violet-100 hover:bg-violet-200/70" },
			{ variant: "secondary", severity: "danger", class: "text-rose-600 bg-rose-100 hover:bg-rose-200/70" },
			
			{ variant: "ghost", severity: "primary", class: "text-zinc-900 bg-transparent hover:bg-slate-200/70" },
			{ variant: "ghost", severity: "success", class: "text-emerald-500 bg-transparent hover:bg-emerald-200/70" },
			{ variant: "ghost", severity: "info", class: "text-blue-500 bg-transparent hover:bg-blue-200/70" },
			{ variant: "ghost", severity: "warn", class: "text-amber-500 bg-transparent hover:bg-amber-200/70" },
			{ variant: "ghost", severity: "help", class: "text-violet-500 bg-transparent hover:bg-violet-200/70" },
			{ variant: "ghost", severity: "danger", class: "text-rose-500 bg-transparent hover:bg-rose-200/70" },
		],
	},
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;

@Directive({
	selector: '[hlmBadge]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmBadgeDirective {
	protected readonly _computedClass = computed(() =>
		hlm(badgeVariants({ variant: this.variant(), size: this.size(), severity: this.severity() }), this.userClass()),
	);		

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly variant = input<BadgeVariants["variant"]>("secondary");
	public readonly size = input<BadgeVariants["size"]>("default");
	public readonly severity = input<BadgeVariants["severity"]>("primary");
}
