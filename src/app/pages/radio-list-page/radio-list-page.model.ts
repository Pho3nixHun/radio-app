import { PageState } from "@app/shared/models/page-state.model";
import { PaginationVM } from "@components/pagination/pagination.component";
import { RadioEntry, RadioSearchOrder } from "@app/shared/models/radio.model";

export interface SortByOptionVM {
    value: RadioSearchOrder;
    label: string;
    selected: boolean;
}

export interface PageSizeOptionVM {
    value: number;
    label: string;
    selected: boolean;
}

export interface RadioListPageVM {
  radioEntries: RadioEntry[];
  paginationVM: PaginationVM;
  sortByOptionVMs: SortByOptionVM[];
  pageSizeOptionVMs: PageSizeOptionVM[];
  hideOffline: boolean;
  empty: boolean;
}

export type RadioListPageState = PageState<RadioListPageVM>;