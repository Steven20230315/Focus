export type ColumnId = string;

export type ColumnRole = 'To Do' | 'In Progress' | 'Done' | 'Pending';

export type Column = {
	ColumnId: ColumnId;
	role: ColumnRole;
};
