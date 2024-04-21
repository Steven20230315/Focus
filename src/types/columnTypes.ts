import { type ListId, type TaskId, type Task } from './';

export type ColumnId = string;

export type ColumnRole = 'To Do' | 'In Progress' | 'Done' | 'Pending';

export interface Column {
	columnId: ColumnId;
	listId: ListId;
	role: ColumnRole;
	taskIds: TaskId[];
}

export interface ColumnWithTasks extends Column {
	tasks: Task[];
}

export type ColumnState = {
	allColumns: Record<ColumnId, Column>;
	// This provide access to the columns in the current list including the task ids
	columnsInCurrentList: Record<ColumnId,Column>;
	// This is for manipulating the order of the columns
	columnIdsInCurrentList: ColumnId[];
};