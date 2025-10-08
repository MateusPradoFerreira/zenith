import { Directive, computed, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';
import { injectBrnButtonConfig } from './hlm-button.token';

export const buttonVariants = cva(
	"border border-transparent inline-flex items-center gap-2 cursor-pointer justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none ring-offset-background",
	{
		variants: {
			variant: {
				default: "bg-zinc-900 text-white hover:bg-zinc-800",
				outline: "border-slate-200 bg-transparent hover:bg-zinc-900 hover:text-white",
				soft: "border-slate-200 bg-slate-100 hover:bg-zinc-900 hover:text-white",
				text: "bg-slate-100 hover:bg-slate-200/70",
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
				default: "h-[38px] text-[13px] px-4 [&_i-lucide]:[&_svg]:w-[21px] shrink-0 [&_i-lucide]:[&_svg]:h-[21px] [&_lucide-angular]:[&_svg]:w-[21px] [&_lucide-angular]:[&_svg]:h-[21px]",
				sm: "py-0.5 px-2 text-[13px] [&_i-lucide]:[&_svg]:w-[16px] shrink-0 [&_i-lucide]:[&_svg]:h-[16px] [&_lucide-angular]:[&_svg]:w-[16px] [&_lucide-angular]:[&_svg]:h-[16px]",
				icon: "h-[38px] w-[38px] p-0 [&_i-lucide]:[&_svg]:w-[21px] shrink-0 [&_i-lucide]:[&_svg]:h-[21px] [&_lucide-angular]:[&_svg]:w-[21px] [&_lucide-angular]:[&_svg]:h-[21px]",
				"icon-lg": "h-[38px] w-[38px] p-0 [&_i-lucide]:[&_svg]:w-[24px] shrink-0 [&_i-lucide]:[&_svg]:h-[24px] [&_lucide-angular]:[&_svg]:w-[24px] [&_lucide-angular]:[&_svg]:h-[24px]",
				"icon-sm": "h-[28px] w-[28px] p-0 [&_i-lucide]:[&_svg]:w-[16px] shrink-0 [&_i-lucide]:[&_svg]:h-[16px] [&_lucide-angular]:[&_svg]:w-[16px] [&_lucide-angular]:[&_svg]:h-[16px]",
			},
		},
		defaultVariants: {
			variant: "default",
			severity: "primary",
			size: "default",
		},
		compoundVariants: [
			{ variant: "outline", severity: "primary", class: "text-zinc-900 border-slate-200 bg-transparent hover:bg-slate-100 hover:text-zinc-900 disabled:text-slate-200 disabled:border-slate-200" },
			{ variant: "outline", severity: "success", class: "text-emerald-500 border-emerald-500 bg-transparent hover:bg-emerald-500 hover:text-white disabled:text-slate-200 disabled:border-slate-200" },
			{ variant: "outline", severity: "info", class: "text-blue-500 border-blue-500 bg-transparent hover:bg-blue-500 hover:text-white disabled:text-slate-200 disabled:border-slate-200" },
			{ variant: "outline", severity: "warn", class: "text-amber-500 border-amber-500 bg-transparent hover:bg-amber-500 hover:text-white disabled:text-slate-200 disabled:border-slate-200" },
			{ variant: "outline", severity: "help", class: "text-violet-500 border-violet-500 bg-transparent hover:bg-violet-500 hover:text-white disabled:text-slate-200 disabled:border-slate-200" },
			{ variant: "outline", severity: "danger", class: "text-rose-500 border-rose-500 bg-transparent hover:bg-rose-500 hover:text-white disabled:text-slate-200 disabled:border-slate-200" },

			{ variant: "soft", severity: "primary", class: "text-zinc-900 border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-zinc-900 disabled:text-slate-200 disabled:bg-slate-50 disabled:border-slate-200" },
			{ variant: "soft", severity: "success", class: "text-emerald-500 border-emerald-200 bg-emerald-50 hover:bg-emerald-500100 hover:text-emerald-500 disabled:text-slate-200 disabled:bg-slate-50 disabled:border-slate-200" },
			{ variant: "soft", severity: "info", class: "text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-500 disabled:text-slate-200 disabled:bg-slate-50 disabled:border-slate-200" },
			{ variant: "soft", severity: "warn", class: "text-amber-500 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-500 disabled:text-slate-200 disabled:bg-slate-50 disabled:border-slate-200" },
			{ variant: "soft", severity: "help", class: "text-violet-500 border-violet-200 bg-violet-50 hover:bg-violet-100 hover:text-violet-500 disabled:text-slate-200 disabled:bg-slate-50 disabled:border-slate-200" },
			{ variant: "soft", severity: "danger", class: "text-rose-500 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:text-rose-500 disabled:text-slate-200 disabled:bg-slate-50 disabled:border-slate-200" },
			
			{ variant: "text", severity: "primary", class: "text-zinc-900 bg-slate-100 hover:bg-slate-200/70 disabled:text-slate-200 disabled:bg-slate-50" },
			{ variant: "text", severity: "success", class: "text-emerald-600 bg-emerald-100 hover:bg-emerald-200/70 disabled:text-slate-200 disabled:bg-slate-50" },
			{ variant: "text", severity: "info", class: "text-blue-600 bg-blue-100 hover:bg-blue-200/70 disabled:text-slate-200 disabled:bg-slate-50" },
			{ variant: "text", severity: "warn", class: "text-amber-600 bg-amber-100 hover:bg-amber-200/70 disabled:text-slate-200 disabled:bg-slate-50" },
			{ variant: "text", severity: "help", class: "text-violet-600 bg-violet-100 hover:bg-violet-200/70 disabled:text-slate-200 disabled:bg-slate-50" },
			{ variant: "text", severity: "danger", class: "text-rose-600 bg-rose-100 hover:bg-rose-200/70 disabled:text-slate-200 disabled:bg-slate-50" },
			
			{ variant: "ghost", severity: "primary", class: "text-zinc-900 bg-transparent hover:bg-slate-200/70 disabled:text-slate-200" },
			{ variant: "ghost", severity: "success", class: "text-emerald-500 bg-transparent hover:bg-emerald-200/70 disabled:text-slate-200" },
			{ variant: "ghost", severity: "info", class: "text-blue-500 bg-transparent hover:bg-blue-200/70 disabled:text-slate-200" },
			{ variant: "ghost", severity: "warn", class: "text-amber-500 bg-transparent hover:bg-amber-200/70 disabled:text-slate-200" },
			{ variant: "ghost", severity: "help", class: "text-violet-500 bg-transparent hover:bg-violet-200/70 disabled:text-slate-200" },
			{ variant: "ghost", severity: "danger", class: "text-rose-500 bg-transparent hover:bg-rose-200/70 disabled:text-slate-200" },
		],
	},
);
export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
	selector: "[hlmBtn]",
	standalone: true,
	exportAs: "hlmBtn",
	host: {
		"[class]": "_computedClass()",
	},
})
export class HlmButtonDirective {
	private readonly _config = injectBrnButtonConfig();

	private readonly _additionalClasses = signal<ClassValue>("");

	public readonly userClass = input<ClassValue>("", { alias: "class" });

	protected readonly _computedClass = computed(() =>
		hlm(buttonVariants({ variant: this.variant(), size: this.size(), severity: this.severity() }), this.userClass(), this._additionalClasses()),
	);

	public readonly variant = input<ButtonVariants["variant"]>(this._config.variant);
	public readonly size = input<ButtonVariants["size"]>(this._config.size);
	public readonly severity = input<ButtonVariants["severity"]>(this._config.severity);

	setClass(classes: string): void {
		this._additionalClasses.set(classes);
	}

}