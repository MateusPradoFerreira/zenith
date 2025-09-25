import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, ViewChild, ViewEncapsulation } from "@angular/core";
import { GlobalModule } from "../../../core/modules/global-module.module";
import Chart from 'chart.js/auto';
import { hlm } from "@spartan-ng/brain/core";
import { ClassValue } from "clsx";

@Component({
  standalone: true,
  selector: 'app-cash-flow-chart-card',
  imports: [GlobalModule],
  template: `
    <h3 class="text-xs text-slate-500">{{ label() }}</h3>
    <div class="row-span-2 h-15 flex items-center">
      <canvas #canvas></canvas>
    </div>
    <div class="">
      <h2 class="text-xl font-medium mb-1">{{ total() | currency: "BRL" }}</h2>
      <div class="text-xs text-slate-500 flex items-center gap-1">
        <span class="px-1 border-1 border-emerald-200 bg-emerald-50 text-emerald-500 rounded flex items-center w-fit gap-1">
          <i-lucide name="trending-up" size="12" />
          7%
        </span>
        vs ano passado
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
  host: {
		'[class]': '_computedClass()',
	},
})
export class CashFlowChartCardComponent {
  label = input.required<string>();
  values = input.required<number[]>();
  total = computed(() => this.values().reduce((prev, crr) => prev + crr, 0));

  valuesEffect = effect(() => {
    if (this._chart) this._chart.destroy();
    this.configureChart();
  });

  private _chart: Chart;

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  public readonly ngClass = input<any>('', { alias: 'ngClass' });
  protected _computedClass = computed(() =>
    hlm(
      'h-23 pl-4 py-2.5 border-1 border-slate-200 rounded-md grid grid-cols-[45%_55%] grid-row-[auto_1fr] gap-1',
      this.userClass(),
    ),
  );

  @ViewChild("canvas", { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  configureChart() {
    const ctx = this.canvas.nativeElement.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 40);
    gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
    gradient.addColorStop(0, "rgba(139, 92, 246, 0.4)");

    this._chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array(this.values().length).fill(""),
        datasets: [{
          data: this.values(),
          borderColor: "#8b5cf6",
          borderWidth: 1.5,
          tension: 0.3,
          fill: true,
          backgroundColor: gradient,
          pointRadius: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        layout: {
          padding: {
            top: 5,
            bottom: 5,
            left: 5,
            right: 5
          }
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        animations: {
          tension: {
            duration: 1000,
            easing: "easeInOutCirc",
            from: 0.3,
            to: 0.4,
            loop: true
          },
        },
      },
    });
  };
};