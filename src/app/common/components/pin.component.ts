import { ChangeDetectionStrategy, Component, computed, input, model, ViewEncapsulation } from "@angular/core";
import { hlm } from "@spartan-ng/brain/core";
import { cva, VariantProps } from "class-variance-authority";
import { ClassValue } from "clsx";

export const pinVariants = cva(
  "w-2 h-2 rounded",
  {
    variants: {
      color: {
        slate: "bg-slate-300",
        SLATE: "bg-slate-300",
        zinc: "bg-zinc-300",
        ZINC: "bg-zinc-300",
        stone: "bg-stone-300",
        STONE: "bg-stone-300",
        red: "bg-red-300",
        RED: "bg-red-300",
        orange: "bg-orange-300",
        ORANGE: "bg-orange-300",
        amber: "bg-amber-300",
        AMBER: "bg-amber-300",
        yellow: "bg-yellow-300",
        YELLOW: "bg-yellow-300",
        lime: "bg-lime-300",
        LIME: "bg-lime-300",
        green: "bg-green-300",
        GREEN: "bg-green-300",
        emerald: "bg-emerald-300",
        EMERALD: "bg-emerald-300",
        teal: "bg-teal-300",
        TEAL: "bg-teal-300",
        cyan: "bg-cyan-300",
        CYAN: "bg-cyan-300",
        sky: "bg-sky-300",
        SKY: "bg-sky-300",
        blue: "bg-blue-300",
        BLUE: "bg-blue-300",
        indigo: "bg-indigo-300",
        INDIGO: "bg-indigo-300",
        violet: "bg-violet-300",
        VIOLET: "bg-violet-300",
        purple: "bg-purple-300",
        PURPLE: "bg-purple-300",
        fuchsia: "bg-fuchsia-300",
        FUCHSIA: "bg-fuchsia-300",
        pink: "bg-pink-300",
        PINK: "bg-pink-300",
        rose: "bg-rose-300",
        ROSE: "bg-rose-300",
      },
    },
    defaultVariants: {
      color: "slate", 
    },
  },
);
export type PinVariants = VariantProps<typeof pinVariants>;

@Component({
  selector: 'hlm-pin',
  imports: [],
  host: {
    '[class]': '_computedClass()',
  },
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HlmPinComponent {
  color = model<PinVariants["color"]>("slate");

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm(pinVariants({ color: this.color() }), this.userClass()));
};