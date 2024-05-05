import { type ColumnId } from './columnTypes';

export type ListId = string;

export type List = {
  title: string;
  listId: ListId;
  columnIds: ColumnId[];
};

export type Lists = Record<ListId, List>;

export type ListsOrder = ListId[];

export interface ListsState {
  allLists: Lists;
  listsOrder: ListsOrder;
  currentListId: ListId | null;
  isSidebarOpen: boolean;
}

export type UpdateListTitlePayload = {
  listId: ListId;
  title: string;
};
