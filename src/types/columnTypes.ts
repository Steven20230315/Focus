import { type ListId, type TaskId, type Task } from './';

export type ColumnId = string;

// I think users can choose to create a statusless column
export type ColumnRole = 'To Do' | 'In Progress' | 'Done' | 'Pending' | 'None';

export interface Column {
  columnId: ColumnId;
  listId: ListId;
  title: string;
  role: ColumnRole;
  taskIds: TaskId[];
  userId: string;
}

export interface ColumnWithTasks extends Column {
  tasks: Task[];
}

export type ColumnState = {
  allColumns: Record<ColumnId, Column>;
  status: string;
  // This provide access to the columns in the current list including the task ids
};
