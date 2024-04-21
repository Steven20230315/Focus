import {
	createSlice,
	type ActionReducerMapBuilder,
	type PayloadAction,
} from '@reduxjs/toolkit';
import {
	type ColumnId,
	type ColumnRole,
	type Column,
	type List,
	type TaskId,
	type ColumnState,
	type Task,
} from '../../types';
import {
	addListWithDefaultColumns,
	deleteList,
	setCurrentList,
} from '../list/listSlice';
import { addTask, deleteTask, taskMoveBetweenColumns } from '../task/taskSlice';
import { columnSliceInitialState } from './columnData';
import type { DropResult } from '@hello-pangea/dnd';

export interface updateColumnPayload {
	columnId: ColumnId;
	taskId: TaskId;
}

const columnSlice = createSlice({
	name: 'column',
	initialState: columnSliceInitialState,
	reducers: {
		addColumns(
			state: ColumnState,
			action: PayloadAction<Record<ColumnId, Column>>
		) {
			Object.assign(state.allColumns, action.payload);
			console.log('Columns added:', action.payload);
		},
		updateColumn(
			state: ColumnState,
			action: PayloadAction<updateColumnPayload>
		) {
			const { columnId, taskId } = action.payload;
			const currentColumn = state.allColumns[columnId];
			currentColumn.taskIds.push(taskId);
		},
		updateCurrentColumnsOrder(
			state: ColumnState,
			action: PayloadAction<DropResult>
		) {
			const { source, destination, draggableId } = action.payload;
			if (!(draggableId in state.allColumns)) {
				throw new Error('The column you want to move does not exist');
			}
			if (!destination) {
				console.log('No destination');
				return;
			}
			if (source.droppableId !== destination.droppableId) {
				console.log('Column only has one droppable area');
			}
			if (source.droppableId === destination.droppableId) {
				const oldIndex = source.index;
				const newIndex = destination.index;
				state.columnIdsInCurrentList.splice(oldIndex, 1);
				state.columnIdsInCurrentList.splice(newIndex, 0, draggableId);
			}
		},
		updateTasksOrderInColumn(
			state: ColumnState,
			action: PayloadAction<DropResult>
		) {
			const { source, destination, draggableId } = action.payload;
			if (!(draggableId in state.allColumns)) {
				throw new Error('The column you want to move does not exist');
			}
			if (!destination) {
				console.log('No destination');
				return;
			}
			if (source.droppableId !== destination.droppableId) {
				console.log('Column only has one droppable area');
			}
			if (source.droppableId === destination.droppableId) {
				const oldIndex = source.index;
				const newIndex = destination.index;
				state.allColumns[draggableId].taskIds.splice(oldIndex, 1);
				state.allColumns[draggableId].taskIds.splice(newIndex, 0, draggableId);
				state.columnsInCurrentList[draggableId].taskIds.splice(oldIndex, 1);
				state.columnsInCurrentList[draggableId].taskIds.splice(
					newIndex,
					0,
					draggableId
				);
			}
		},
	},
	// I think I might remove this. I'll just use a utility function to create project and columns at the same time. Instead of passing more Info in the payload.
	extraReducers: (builder: ActionReducerMapBuilder<ColumnState>) => {
		builder
			.addCase(
				addListWithDefaultColumns,
				(state: ColumnState, action: PayloadAction<List>) => {
					const roles: ColumnRole[] = [
						'To Do',
						'In Progress',
						'Done',
						'Pending',
					];
					const { columnIds, listId } = action.payload;
					roles.forEach((role: ColumnRole, index: number) => {
						const columnId = columnIds[index]; // Make sure columnIds exist and are correctly indexed
						state.allColumns[columnId] = {
							columnId,
							role: role,
							taskIds: [],
							listId,
						};
					});
				}
			)
			.addCase(
				setCurrentList,
				(state: ColumnState, action: PayloadAction<List>) => {
					// When the current list changes, update columnsInCurrentList
					const { columnIds } = action.payload;
					// First clear out the columnsInCurrentList
					state.columnsInCurrentList = {};
					// Then update columnsInCurrentList
					columnIds.map((columnId: ColumnId) => {
						state.columnsInCurrentList[columnId] = state.allColumns[columnId];
					});
					state.columnIdsInCurrentList = columnIds;
				}
			)
			.addCase(
				deleteList,
				(state: ColumnState, action: PayloadAction<List>) => {
					const { columnIds } = action.payload;
					columnIds.forEach((columnId: ColumnId) => {
						delete state.allColumns[columnId];
					});
				}
			)
			.addCase(addTask, (state: ColumnState, action: PayloadAction<Task>) => {
				const { columnId, taskId } = action.payload;
				const addTaskIdToThisColumn = state.allColumns[columnId];
				addTaskIdToThisColumn.taskIds.push(taskId);
				state.columnsInCurrentList[columnId].taskIds.push(taskId);
			})
			.addCase(
				deleteTask,
				(state: ColumnState, action: PayloadAction<Task>) => {
					const { columnId, taskId } = action.payload;
					const deleteTaskIdFromThisColumn = state.allColumns[columnId];
					deleteTaskIdFromThisColumn.taskIds.splice(
						deleteTaskIdFromThisColumn.taskIds.indexOf(taskId),
						1
					);
					state.columnsInCurrentList[columnId].taskIds.splice(
						state.columnsInCurrentList[columnId].taskIds.indexOf(taskId),
						1
					);
					console.log('Task deleted:', taskId);
				}
			)
			.addCase(
				taskMoveBetweenColumns,
				(state: ColumnState, action: PayloadAction<DropResult>) => {
					const { source, destination, draggableId } = action.payload;
					if (!destination) return;
					const sourceColumn = state.allColumns[source.droppableId];
					const destinationColumn = state.allColumns[destination.droppableId];

					if (!sourceColumn || !destinationColumn) {
						console.log(
							'Source or destination column does not exist in allColumns'
						);
						return;
					}

					// Remove tasks in the source column
					const taskIndex = sourceColumn.taskIds.indexOf(draggableId);
					if (taskIndex > -1) {
						sourceColumn.taskIds.splice(taskIndex, 1);
					}

					// Add task to the destination column
					// destinationColumn.taskIds.splice(destination.index, 0, draggableId);
					// state.allColumns[draggableId].taskIds.splice(
					// 	destination.index,
					// 	0,
					// 	draggableId
					// );
					// state.columnsInCurrentList[draggableId].taskIds.splice(
					// 	source.index,
					// 	1
					// );
					// state.columnsInCurrentList[draggableId].taskIds.splice(
					// 	destination.index,
					// 	0,
					// 	draggableId
					// );
				}
			);
	},
});

export const {
	addColumns,
	updateColumn,
	updateCurrentColumnsOrder,
	updateTasksOrderInColumn,
} = columnSlice.actions;
export default columnSlice.reducer;
