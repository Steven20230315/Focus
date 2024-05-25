import { type ListId, type ColumnId, type ColumnRole } from './';
export type TaskId = string;
export type Priority = 'Low' | 'Normal' | 'High' | 'Urgent';

export type TaskStatus = ColumnRole;
export type Task = {
  title: string;
  taskId: TaskId;
  listId: ListId;
  columnId: ColumnId;
  userId: string;
  // This is needed to identify which column the task belongs to (columns are identified by their project ID)
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  timeSpent: number;
  pomodoroLength: number;
};
