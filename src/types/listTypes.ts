import { type ColumnId } from './columnTypes';

export type ListId = string;

export type List = {
  title: string;
  listId: ListId;
  // This is to store the order of the columns, so that when the columns are reordered, the order is maintained
  columnIdsOrder: ColumnId[];
  // This is to store the original order of the columns
  columnIds: ColumnId[];
};
