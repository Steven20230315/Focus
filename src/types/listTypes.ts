import { type ColumnId } from './columnTypes';

export type ListId = string;

export type List = {
  title: string;
  listId: ListId;
  columnIds: ColumnId[];
};
