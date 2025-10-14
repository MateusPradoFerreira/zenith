import { BooleanInput } from '@angular/cdk/coercion';
import { AfterViewInit, booleanAttribute, Component, computed, forwardRef, input, model, output, signal } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar } from '@ng-icons/lucide';
import { hlm } from '@spartan-ng/helm/utils';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/brain/popover';
import { HlmCalendarComponent } from '@spartan-ng/ui-calendar-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import type { ClassValue } from 'clsx';
import { injectHlmDatePickerConfig } from './hlm-date-picker.token';
import Inputmask from 'inputmask';
import moment from 'moment';

export const HLM_DATE_PICKER_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => HlmDatePickerComponent),
	multi: true,
};

@Component({
	selector: 'hlm-date-picker',
	imports: [
		NgIcon,
		HlmIconDirective,
		BrnPopoverComponent,
		BrnPopoverTriggerDirective,
		BrnPopoverContentDirective,
		HlmPopoverContentDirective,
		HlmCalendarComponent,
		FormsModule,
	],
	providers: [HLM_DATE_PICKER_VALUE_ACCESSOR, provideIcons({ lucideCalendar })],
	template: `
		<brn-popover sideOffset="5" [state]="popoverState()" (stateChanged)="popoverState.set($event)" class="peer">
			<div class="flex relative group">
				<input [(ngModel)]="inputDate" [class]="_computedClass()" [disabled]="state().disabled() || readonly()" [id]="key" (blur)="_handleBlurInput()"/>
				<button brnPopoverTrigger type="button" [disabled]="state().disabled() || readonly()" class="absolute top-0 right-0 transition-colors disabled:pointer-events-none hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-700 border-y border-r border-slate-200 cursor-pointer bg-background rounded-r-md flex items-center justify-center w-[38px] h-[38px] shrink-0"> <ng-icon hlm size="sm" name="lucideCalendar"/> </button>
			</div>

			<div hlmPopoverContent class="w-auto p-0" *brnPopoverContent="let ctx">
				<hlm-calendar
					calendarClass="border-0 rounded-none"
					[date]="date()"
					[min]="min()"
					[max]="max()"
					[disabled]="state().disabled() || readonly()"
					(dateChange)="_handleChange($event)"
				/>
			</div>
		</brn-popover>
	`,
	host: {
		class: 'block',
	},
})
export class HlmDatePickerComponent<T> implements AfterViewInit {
	private readonly _config = injectHlmDatePickerConfig<T>();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'w-full inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors border border-slate-200 bg-background h-[38px] px-4 py-2 w-full cursor-pointer justify-start text-left font-normal',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			'disabled:pointer-events-none disabled:bg-slate-50 disabled:text-slate-700',
			'[&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0',
			!this.date() ? 'text-muted-foreground' : '',
			this.userClass(),
		),
	);

	public readonly key = String(Math.random());

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	public readonly readonly = input<boolean>();


	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = model<T>();
	public readonly inputDate = signal<string>(null);

	/** If true, the date picker will close when a date is selected. */
	public readonly autoCloseOnSelect = input<boolean, BooleanInput>(this._config.autoCloseOnSelect, {
		transform: booleanAttribute,
	});

	/** Defines how the date should be displayed in the UI.  */
	public readonly formatDate = input<(date: T) => string>(this._config.formatDate);

	/** Defines how the date should be transformed before saving to model/form. */
	public readonly transformDate = input<(date: T) => T>(this._config.transformDate);

	public readonly forceSelection = input<boolean>(false);

	protected readonly popoverState = signal<BrnDialogState | null>(null);

	protected readonly state = computed(() => ({
		disabled: signal(this.disabled()),
	}));

	protected readonly formattedDate = computed(() => {
		const date = this.date();
		return date ? this.formatDate()(date) : undefined;
	});

	public readonly changed = output<T>();

	protected _onChange?: ChangeFn<T>;
	protected _onTouched?: TouchFn;

	protected _handleChange(value: T) {
		if (this.state().disabled() || (this.forceSelection() && !value)) return;
		const transformedDate = this.transformDate()(value);

		this.inputDate.set(!value? null : moment(value).format("DD/MM/YYYY"));
		this.date.set(transformedDate);
		this._onChange?.(transformedDate);
		this.changed.emit(transformedDate);

		if (this.autoCloseOnSelect()) {
			this.popoverState.set('closed');
		}
	}

	protected _handleBlurInput() {
		const validDate = this.inputDate()?.includes("_")? false : moment(this.inputDate(), "DD/MM/YYYY").isValid();
		if(!validDate) {
			this.inputDate.set(this.forceSelection() && this.date()? moment(this.date()).format("DD/MM/YYYY") : null);
			return;
		};

		this._handleChange(moment(this.inputDate(), "DD/MM/YYYY").toDate() as T);
	};

	ngAfterViewInit(): void {
		new Inputmask("99/99/9999").mask(document.getElementById(this.key));
	};

	/** CONROL VALUE ACCESSOR */
	writeValue(value: T | null): void {
		// optional FormControl is initialized with null value
		if (value === null) return;

		this.inputDate.set(moment(value).format("DD/MM/YYYY"));
		this.date.set(this.transformDate()(value));
	}

	registerOnChange(fn: ChangeFn<T>): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: TouchFn): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.state().disabled.set(isDisabled);
	}

	open() {
		this.popoverState.set('open');
	}

	close() {
		this.popoverState.set('closed');
	}
}
