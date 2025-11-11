import { GlobalModule } from "../../../../../../../core/modules/global-module.module";
import { AfterContentInit, Component, computed, ContentChild, ContentChildren, effect, HostListener, input, model, OnInit, output, QueryList, signal, TemplateRef, ViewChild } from "@angular/core";
import { PllID } from "@pollaris";
import { hlm } from "@spartan-ng/brain/core";
import { ClassValue } from "clsx";
import { HlmTemplateDirective } from "../../../../../../directives/hlm-template.directive";
import { BrnMenuItem } from "@spartan-ng/ui-menu-helm";

export type HlmDataTableRecord = Record<any, any> & { id: PllID };
export type HlmDataTableColumn = { header: string, field?: string, class?: string };
export type HlmDataTableAction = BrnMenuItem;
export type HlmDataTableActionFc<TModel> = (data: TModel) => HlmDataTableAction[];
export type HlmDataTableSelectionActionFc<TModel> = (data: TModel[]) => HlmDataTableAction[];

@Component({
  selector: 'hlm-data-table',
  imports: [GlobalModule],
  templateUrl: './hlm-data-table.component.html',
})
export class HlmDataTableComponent implements OnInit, AfterContentInit {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm("border-t border-slate-200 h-full", this.userClass()));

  header = input<string>();
  showHeader = input<boolean>(true);

  loading = input<boolean>(false);
  values = input<HlmDataTableRecord[]>([]);
  columns = input<HlmDataTableColumn[]>([]);

  actionFn = input<HlmDataTableActionFc<any>>();
  actions = computed<{[key: PllID]: HlmDataTableAction[]}>(() => {
    if(!this.actionFn()) return null;
    const actions: any = {};
    for(let value of this.values()) actions[value.id] = this.actionFn()(value);
    return actions;
  });

  selectionActionFn = input<HlmDataTableSelectionActionFc<any>>(null);
  selectionActions = computed<HlmDataTableAction[]>(() => {
    if(!this.selectionActionFn()) return null;
    return this.selectionActionFn()(this.paginatedValues().filter(record => this.selection().includes(record.id)));
  });

  layout = model<string>("table");

  layoutEffect = effect(() => {
    if(this.layout() === "table") {
      this.body.set(this.tableTemplate);
      return;
    };

    if(this.layout() === "grid") {
      this.body.set(this.gridTemplate);
      return;
    };
  });
  
  filteredValues = model<HlmDataTableRecord[]>([]);
  paginatedValues = model<HlmDataTableRecord[]>([]);

  // config
  filter = input<boolean>(true);
  pagination = input<boolean>(true);
  multiselect = input<boolean>(false);
  colHeader = input<boolean>(true);
  showEmptyMessOnTbBody = input<boolean>(true);
  showEmptyIconOnTbBody = input<boolean>(true);
  emptyIconOnTbBody = input<string>("search");

  // query
  page = model(1);
  size = model(25);
  sort = model<"ASC" | "DESC">("ASC");
  query = model<string>("");
  totalItems = input<string>();

  queryEffect = effect(() => {
    const normalize = (value: any) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const filteredValues = this.values().filter(i => Object.values(i).some(v => normalize(v).includes(normalize(this.query()))));
    const sortedValues = this.sort() === "ASC"? filteredValues : filteredValues.reverse();
    const paginatedValues = sortedValues.slice((this.page() - 1) * this.size(), this.page() * this.size());
    this.filteredValues.set(this.pagination()? sortedValues : filteredValues);
    this.paginatedValues.set(this.pagination()? paginatedValues : filteredValues);
    this.selection.set([]);
  });

  queryTimeout: NodeJS.Timeout;
  resizeTimeout: NodeJS.Timeout;

  // multiselect
  selection = model<PllID[]>([]);
  hasSelection = computed<boolean>(() => !!this.selection().length);
  allSelection = computed<boolean>(() => this.paginatedValues().every(record => this.selection().includes(record.id)));

  // outputs
  onSelect = output<any>();
  onPaginate = output<{ page: number, size: number }>();
  onInputSearch = output<string>();

  scroll = model<"scroll" | "auto">("scroll");
  offsetHeight = model<number>();
  fixedHeight = model<number>();
  autoHeight = model<boolean>(false);
  height = signal("auto");
  heightNb = signal(0);

  offsetEffect = effect(() => {
    this.offsetHeight();
    this.setHeight();
  });

  @ContentChildren(HlmTemplateDirective) templates!: QueryList<HlmTemplateDirective>;
  
  @ContentChild("row", { static: true }) rowTemplate: TemplateRef<any>;
  @ContentChild("cell", { static: true }) cellTemplate: TemplateRef<any>;
  @ContentChild("action", { static: true }) actionTemplate: TemplateRef<any>;
  @ContentChild("left-action", { static: true }) leftActionTemplate: TemplateRef<any>;
  @ContentChild("filter", { static: true }) filterTemplate: TemplateRef<any>;
  @ContentChild("selection", { static: true }) selectionTemplate: TemplateRef<any>;
  @ContentChild("empty-actions", { static: true }) emptyActionsTemplate: TemplateRef<any>;
  @ContentChild("body", { static: true }) bodyTemplate: TemplateRef<any>;
  @ContentChild("table-body", { static: true }) tableBodyTemplate: TemplateRef<any>;
  @ContentChild("prev-body", { static: true }) prevBodyTemplate: TemplateRef<any>;
  @ContentChild("layout-body", { static: true }) layoutBodyTemplate: TemplateRef<any>;

  @ViewChild("table", { static: true }) tableTemplate: TemplateRef<any>;
  @ViewChild("grid", { static: true }) gridTemplate: TemplateRef<any>;
  body = signal<TemplateRef<any>>(null);

  @HostListener('window:resize')
  onResize() {
    this.setHeightTimeout();
  };

  setHeightTimeout() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => this.setHeight(), 200);
  };

  setHeight() {
    const height = document.getElementById("main-container")?.offsetHeight - 54 - this.offsetHeight();
    const fixedHeight = this.fixedHeight() || height;
    this.height.set(this.autoHeight()? "auto" : (fixedHeight + "px"));
    this.heightNb.set(height);
  };

  ngOnInit() {};

  ngAfterContentInit() {
    for(let ngTemplate of this.templates) {
      if (ngTemplate.name === "row") this.rowTemplate = ngTemplate.template;
      if (ngTemplate.name === "cell") this.cellTemplate = ngTemplate.template;
      if (ngTemplate.name === "action") this.actionTemplate = ngTemplate.template;
      if (ngTemplate.name === "left-action") this.leftActionTemplate = ngTemplate.template;
      if (ngTemplate.name === "filter") this.filterTemplate = ngTemplate.template;
      if (ngTemplate.name === "selection") this.selectionTemplate = ngTemplate.template;
      if (ngTemplate.name === "empty-actions") this.emptyActionsTemplate = ngTemplate.template;
      if (ngTemplate.name === "body") this.bodyTemplate = ngTemplate.template;
      if (ngTemplate.name === "table-body") this.tableBodyTemplate = ngTemplate.template;
      if (ngTemplate.name === "prev-body") this.prevBodyTemplate = ngTemplate.template;
      if (ngTemplate.name === "layout-body") this.layoutBodyTemplate = ngTemplate.template;
    };
  };

  handleToggleSort() {
    this.sort.set(this.sort() === "ASC"? "DESC" : "ASC");
  };

  rowSelect(event: MouseEvent, rowData: HlmDataTableRecord) {
    if(!event.ctrlKey || !this.multiselect()) {
      this.onSelect.emit(rowData);
      return;
    };
    this.handleSelecion(rowData.id);
  };

  handleSelecion(id: PllID) {
    if(!this.selection().includes(id)) {
      this.selection.set([ ...this.selection(), id ]);
      return;
    };
    this.selection.set(this.selection().filter(slId => slId !== id));
  };

  handleAllSelection() {
    if(this.allSelection()) {
      this.selection.set([]);
      return;
    };
    this.selection.set(this.paginatedValues().map(val => val.id));
  };

  handleEmitOnInputSearch() {
    clearTimeout(this.queryTimeout);
    this.queryTimeout = setTimeout(() => this.onInputSearch.emit(this.query()), 500);
  };

  isMobile() {
    if(window.innerWidth < 1280) return true;
    return false;
  };
};