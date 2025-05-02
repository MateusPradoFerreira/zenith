import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, Component, ContentChild, ContentChildren, EventEmitter, Injector, Input, OnInit, Output, QueryList, TemplateRef, WritableSignal, computed, effect, inject, input, signal, model, ModelSignal } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import type { ClassValue } from 'clsx';
import { HlmTrowComponent } from './hlm-trow.component';
import { HlmThComponent } from './hlm-th.component';
import { HlmTableComponent } from './hlm-table.component';
import { HlmPaginationModule } from '../../../ui-pagination-helm/src';
import { HlmTemplateDirective } from '../../../../../directives/hlm-template.directive';
import { LucideAngularModule } from 'lucide-angular';
import { HlmInputModule } from '../../../ui-input-helm/src';
import { FormsModule } from '@angular/forms';
import { ID } from '../../../../../../core/types/form-schema.type';

export type HlmDataTableColumn = { header: string, class: string };
export type HlmPaginationQuery = { query: string, page: number, pageSize: number };

export type HlmDataTableRegistry = Record<any, any> & {
  id: ID;
  active?: boolean;
};

@Component({
  selector: 'hlm-data-table',
  imports: [NgForOf, NgIf, FormsModule, HlmTableComponent, HlmThComponent, HlmTrowComponent, HlmPaginationModule, NgTemplateOutlet, LucideAngularModule, HlmInputModule],
  templateUrl: './hlm-data-table.component.html',
})
export class HlmDataTableComponent implements OnInit, AfterContentInit {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm("border border-slate-200 rounded-md", this.userClass()));

  @Input() values: WritableSignal<HlmDataTableRegistry[]> = signal([]);;
  @Input() columns: HlmDataTableColumn[] = [];

  @Input() header: string = "";

  @Input() useInternalPagination: boolean = true;
  @Output() onChangePagination: EventEmitter<HlmPaginationQuery> = new EventEmitter();

  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  @ContentChildren(HlmTemplateDirective) templates!: QueryList<HlmTemplateDirective>;

  @ContentChild("row", { static: true }) rowTemplate: TemplateRef<any>;
  @ContentChild("body", { static: true }) bodyTemplate: TemplateRef<any>;
  @ContentChild("header", { static: true }) headerTemplate: TemplateRef<any>;
  @ContentChild("footer", { static: true }) footerTemplate: TemplateRef<any>;
  @ContentChild("action", { static: true }) actionTemplate: TemplateRef<any>;

  filteredValues: HlmDataTableRegistry[] = [];
  paginatedValues: HlmDataTableRegistry[] = [];

  // pagination and filtration
  page: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(10);
  query: WritableSignal<string> = signal("");

  paginationQuery: ModelSignal<HlmPaginationQuery> = model({ page: 1, pageSize: 10, query: "" });

  private _injector = inject(Injector);

  ngOnInit() {
    this._configureEffects();
  };

  ngAfterContentInit() {
    for(let ngTemplate of this.templates) {
      if (ngTemplate.name === "row") this.rowTemplate = ngTemplate.template;
      if (ngTemplate.name === "body") this.bodyTemplate = ngTemplate.template;
      if (ngTemplate.name === "header") this.headerTemplate = ngTemplate.template;
      if (ngTemplate.name === "footer") this.footerTemplate = ngTemplate.template;
      if (ngTemplate.name === "action") this.actionTemplate = ngTemplate.template;
    };
  };

  private _configureEffects() {
    effect(() => { this.values(); this.page(); this.pageSize(); this.query(); this._filterPaginatorResult() }, { injector: this._injector });
  };

  private _filterPaginatorResult() {
    this.paginationQuery.set({ page: this.page(), pageSize: this.pageSize(), query: this.query() });
    this.onChangePagination.emit(this.paginationQuery());
    if(!this.useInternalPagination) return;
    const normalize = (value: any) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    this.filteredValues = this.values().filter(i => Object.values(i).some(v => normalize(v).includes(normalize(this.query()))));
    this.paginatedValues = this.filteredValues.slice((this.page() - 1) * this.pageSize(), this.page() * this.pageSize());
  };

}
