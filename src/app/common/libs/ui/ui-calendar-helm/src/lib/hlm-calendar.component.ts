import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { Component, booleanAttribute, computed, input, model, numberAttribute, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import {
	BrnCalendarCellButtonDirective,
	BrnCalendarCellDirective,
	BrnCalendarDirective,
	BrnCalendarGridDirective,
	BrnCalendarHeaderDirective,
	BrnCalendarNextButtonDirective,
	BrnCalendarPreviousButtonDirective,
	BrnCalendarWeekDirective,
	BrnCalendarWeekdayDirective,
	Weekday,
	injectBrnCalendarI18n,
} from '@spartan-ng/brain/calendar';
import { hlm } from '@spartan-ng/helm/utils';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { buttonVariants } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import type { ClassValue } from 'clsx';
import moment from 'moment';

@Component({
	selector: 'hlm-calendar',
	imports: [
		BrnCalendarDirective,
		BrnCalendarHeaderDirective,
		BrnCalendarNextButtonDirective,
		BrnCalendarPreviousButtonDirective,
		BrnCalendarWeekdayDirective,
		BrnCalendarWeekDirective,
		BrnCalendarCellButtonDirective,
		BrnCalendarCellDirective,
		BrnCalendarGridDirective,
		NgIcon,
		HlmIconDirective,
	],
	viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
	template: `
		<div
			brnCalendar
			[min]="min()"
			[max]="max()"
			[disabled]="disabled()"
			[(date)]="date"
			[dateDisabled]="dateDisabled()"
			[weekStartsOn]="weekStartsOn()"
			[defaultFocusedDate]="defaultFocusedDate()"
			[class]="_computedCalenderClass()"
		>
			<div class="inline-flex flex-col space-y-4">
				<!-- Header -->
				<div class="space-y-4">
					<div class="relative flex items-center justify-center pt-1">
						<div brnCalendarHeader class="text-sm font-medium">
							{{ heading() }}
						</div>

						<div class="flex items-center space-x-1">
							<button
								brnCalendarPreviousButton
								class="ring-offset-background focus-visible:ring-ring border-input hover:bg-accent hover:text-accent-foreground absolute left-1 inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md border bg-transparent p-0 text-sm font-medium opacity-50 transition-colors hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							>
								<ng-icon hlm name="lucideChevronLeft" size="sm" />
							</button>

							<button
								brnCalendarNextButton
								class="ring-offset-background focus-visible:ring-ring border-input hover:bg-accent hover:text-accent-foreground absolute right-1 inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md border bg-transparent p-0 text-sm font-medium opacity-50 transition-colors hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							>
								<ng-icon hlm name="lucideChevronRight" size="sm" />
							</button>
						</div>
					</div>
				</div>

				<table class="w-full border-collapse space-y-1" brnCalendarGrid>
					<thead>
						<tr class="flex mb-1 gap-0.5">
							<th
								*brnCalendarWeekday="let weekday"
								scope="col"
								class="text-muted-foreground w-9 rounded-md text-[0.8rem] font-normal"
								[attr.aria-label]="i18n.labelWeekday(weekday)"
							>
								{{ i18n.formatWeekdayName(weekday) }}
							</th>
						</tr>
					</thead>

					<tbody role="rowgroup">
						<tr *brnCalendarWeek="let week" class="mt-1 flex w-full gap-0.5">
							@for (date of week; track dateAdapter.getTime(date)) {
								<td
									brnCalendarCell
									class="{{ isAccended(date)? 'bg-slate-100' : '' }} rounded-lg data-[selected]:data-[outside]:bg-accent/50 data-[selected]:bg-accent relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 first:data-[selected]:rounded-l-md last:data-[selected]:rounded-r-md [&:has([aria-selected].day-range-end)]:rounded-r-md"
								>
									<button brnCalendarCellButton [date]="date" [class]="btnClass">
										{{ dateAdapter.getDate(date) }}
									</button>
								</td>
							}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
})
export class HlmCalendarComponent<T> {
	public readonly calendarClass = input<ClassValue>('');

	protected readonly _computedCalenderClass = computed(() => hlm('rounded-md border p-3', this.calendarClass()));

	/** Access the calendar i18n */
	protected readonly i18n = injectBrnCalendarI18n();

	/** Access the date time adapter */
	protected readonly dateAdapter = injectDateAdapter<T>();

	/** The minimum date that can be selected.*/
	public readonly min = input<T>();

	/** The maximum date that can be selected. */
	public readonly max = input<T>();

	/** Determine if the date picker is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The selected value. */
	public readonly date = model<T>();

	/** Whether a specific date is disabled. */
	public readonly dateDisabled = input<(date: T) => boolean>(() => false);

	/** The day the week starts on */
	public readonly weekStartsOn = input<Weekday, NumberInput>(0, {
		transform: (v: unknown) => numberAttribute(v) as Weekday,
	});

	/** The default focused date. */
	public readonly defaultFocusedDate = input<T>();

	/** Access the calendar directive */
	private readonly _calendar = viewChild.required(BrnCalendarDirective);

	public readonly accentedDates = input<Date[]>([]);

	/** Get the heading for the current month and year */
	protected heading = computed(() =>
		this.i18n.formatHeader(
			this.dateAdapter.getMonth(this._calendar().focusedDate()),
			this.dateAdapter.getYear(this._calendar().focusedDate()),
		),
	);

	isAccended(date: Date) {
		if(!this.accentedDates()?.length) return false;
		if(this.accentedDates().map(dt => moment(dt).format("DD-MM-YYYY")).includes(moment(date).format("DD-MM-YYYY"))) return true;
		return false;
	};

	protected readonly btnClass = hlm(
		buttonVariants({ variant: 'ghost' }),
		'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
		'data-[outside]:text-muted-foreground data-[outside]:opacity-50 data-[outside]:aria-selected:bg-accent/50 data-[outside]:aria-selected:text-muted-foreground data-[outside]:aria-selected:opacity-30',
		'data-[today]:bg-violet-200/50 data-[today]:text-accent-foreground',
		'data-[selected]:bg-violet-100 data-[selected]:text-violet-500 data-[selected]:hover:bg-violet-100 data-[selected]:hover:text-violet-500 data-[selected]:focus:bg-violet-100 data-[selected]:focus:text-violet-500',
		'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
	);
}
