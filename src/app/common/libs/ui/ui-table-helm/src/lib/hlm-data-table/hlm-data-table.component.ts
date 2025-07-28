import { GlobalModule } from "../../../../../../../core/modules/global-module.module";
import { AfterContentInit, Component, computed, ContentChild, ContentChildren, effect, input, model, OnInit, output, QueryList, signal, TemplateRef, ViewChild } from "@angular/core";
import { PllID } from "../../../../../../../core/lib/pollaris";
import { hlm } from "@spartan-ng/brain/core";
import { ClassValue } from "clsx";
import { HlmTemplateDirective } from "../../../../../../directives/hlm-template.directive";

type HlmAction = { label: string, icon: string; command?: () => void; disabled?: boolean; visible?: boolean; separator?: boolean; shortcut?: string, items?: HlmDataTableAction[] };
type HlmSeparator = Partial<HlmAction> & { separator: boolean };
export type HlmDataTableRecord = Record<any, any> & { id: PllID };
export type HlmDataTableColumn = { header: string, field?: string, class?: string };
export type HlmDataTableAction = HlmAction | HlmSeparator;
export type HlmDataTableActionFc<TModel> = (data: TModel) => HlmDataTableAction[];
export type HlmDataTableSelectionActionFc<TModel> = (data: TModel[]) => HlmDataTableAction[];

@Component({
  selector: 'hlm-data-table',
  imports: [GlobalModule],
  templateUrl: './hlm-data-table.component.html',
})
export class HlmDataTableComponent implements OnInit, AfterContentInit {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm("border-y border-slate-200 max-h-[700px]", this.userClass()));

  header = input<string>();

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

  // query
  page = model(1);
  size = model(50);
  sort = model<"ASC" | "DESC">("ASC");
  query = model<string>("");

  queryEffect = effect(() => {
    const normalize = (value: any) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const filteredValues = this.values().filter(i => Object.values(i).some(v => normalize(v).includes(normalize(this.query()))));
    const sortedValues = this.sort() === "ASC"? filteredValues : filteredValues.reverse();
    const paginatedValues = sortedValues.slice((this.page() - 1) * this.size(), this.page() * this.size());
    this.filteredValues.set(sortedValues);
    this.paginatedValues.set(paginatedValues);
    this.selection.set([]);
  });

  // multiselect
  selection = model<PllID[]>([]);
  hasSelection = computed<boolean>(() => !!this.selection().length);
  allSelection = computed<boolean>(() => this.paginatedValues().every(record => this.selection().includes(record.id)));

  // outputs
  onSelect = output<any>();
  onPaginate = output<any>();

  @ContentChildren(HlmTemplateDirective) templates!: QueryList<HlmTemplateDirective>;
  
  @ContentChild("row", { static: true }) rowTemplate: TemplateRef<any>;
  @ContentChild("cell", { static: true }) cellTemplate: TemplateRef<any>;
  @ContentChild("action", { static: true }) actionTemplate: TemplateRef<any>;
  @ContentChild("filter", { static: true }) filterTemplate: TemplateRef<any>;
  @ContentChild("selection", { static: true }) selectionTemplate: TemplateRef<any>;

  @ViewChild("table", { static: true }) tableTemplate: TemplateRef<any>;
  @ViewChild("grid", { static: true }) gridTemplate: TemplateRef<any>;
  body = signal<TemplateRef<any>>(null);

  ngOnInit() {};

  ngAfterContentInit() {
    for(let ngTemplate of this.templates) {
      if (ngTemplate.name === "row") this.rowTemplate = ngTemplate.template;
      if (ngTemplate.name === "cell") this.cellTemplate = ngTemplate.template;
      if (ngTemplate.name === "action") this.actionTemplate = ngTemplate.template;
      if (ngTemplate.name === "filter") this.filterTemplate = ngTemplate.template;
      if (ngTemplate.name === "selection") this.selectionTemplate = ngTemplate.template;
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

};