import { type ListId, type ColumnId, type ColumnRole } from './';
export type TaskId = string;
export type Priority = 'Low' | 'Normal' | 'High' | 'Urgent';

export type TaskStatus = ColumnRole;
export type Task = {
  taskId: TaskId;
  title: string;
  // This is needed to identify which column the task belongs to (columns are identified by their project ID)
  listId: ListId;
  columnId: ColumnId;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  timeSpend: number;
};
