import {
	createSlice,
	type PayloadAction,
	type ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import {
	type TaskId,
	type Task,
	type ColumnId,
	type List,
	type ColumnRole,
} from '../../types';
import { updateTasksOrderInColumn } from '../column/columnSlice';
import type { DropResult } from '@hello-pangea/dnd';
import { setCurrentList } from '../list/listSlice';

// TODO: This is only a temporary type definition. For testing purposes.

interface TaskState {
	allTasks: Record<TaskId, Task>;
	tasksInCurrentList: Record<TaskId, Task>;
	taskIdsInCurrentList: TaskId[];
	taskIdsOrderInColumn: Record<ColumnId, TaskId[]>;
	columnIdAndRole: Record<ColumnId, ColumnRole>;
}

const initialState: TaskState = {
	allTasks: {},
	tasksInCurrentList: {},
	taskIdsInCurrentList: [],
	taskIdsOrderInColumn: {},
	columnIdAndRole: {
		'68c83c43-5b6c-4ddd-8718-9504d724b19e': 'To Do',
		'a0ef1554-c6d1-447a-8d6d-09a2e475e92d': 'In Progress',
		'3dbbb74b-9988-4c77-ad3d-90ed04a03894': 'Done',
		'dd02393d-82ac-4105-8ca6-e4fa282c2321': 'Pending',
	},
};

const taskSlice = createSlice({
	name: 'task',
	initialState,
	reducers: {
		addTask: (state: TaskState, action: PayloadAction<Task>) => {
			const { columnId, taskId } = action.payload;
			state.allTasks[taskId] = action.payload;
			state.tasksInCurrentList[taskId] = action.payload;
			state.taskIdsInCurrentList.push(taskId);
			console.log('Add task', action.payload);
			// Add task ID to the appropriate column's order array
			if (!state.taskIdsOrderInColumn[columnId]) {
				state.taskIdsOrderInColumn[columnId] = []; // Initialize if not already present
			}
			state.taskIdsOrderInColumn[columnId].push(taskId);
			// How to update tasks order in column?
			console.log('Task added:', action.payload);
		},
		deleteTask: (state: TaskState, action: PayloadAction<Task>) => {
			if (!(action.payload.taskId in state.allTasks)) {
				throw new Error('The task you want to delete does not exist');
			} else {
				delete state.allTasks[action.payload.taskId];
				delete state.tasksInCurrentList[action.payload.taskId];
			}
		},
		updateTask: (state: TaskState, action: PayloadAction<Task>) => {
			if (!(action.payload.taskId in state.allTasks)) {
				throw new Error('The task you want to update does not exist');
			} else {
				state.allTasks[action.payload.taskId] = action.payload;
			}
		},
		taskMoveInColumn: (state: TaskState, action: PayloadAction<DropResult>) => {
			console.log('This is movement in column');
			const { source, destination, draggableId } = action.payload;
			if (!(draggableId in state.allTasks)) {
				throw new Error('The task you want to move does not exist');
			}
			if (!destination) {
				console.log('No destination');
				return;
			}

			if (source.droppableId !== destination.droppableId) {
				console.log(
					'This  reducer should not be called, it only handles movement in the same column'
				);
			} else {
				const oldIndex = source.index;
				const newIndex = destination.index;
				const columnId = source.droppableId;
				state.taskIdsOrderInColumn[columnId].splice(oldIndex, 1);
				state.taskIdsOrderInColumn[columnId].splice(newIndex, 0, draggableId);
			}
		},
		// Movement between columns needs to update columnState
		taskMoveBetweenColumns: (
			state: TaskState,
			action: PayloadAction<DropResult>
		) => {
			const { source, destination, draggableId } = action.payload;

			if (!destination) {
				return; // Dropped outside any droppable area
			}

			// Remove from old column
			state.allTasks[draggableId].columnId = destination.droppableId;
			const startTasks = state.taskIdsOrderInColumn[source.droppableId];
			startTasks.splice(source.index, 1);

			// Add to new column
			const finishTasks = state.taskIdsOrderInColumn[destination.droppableId];
			finishTasks.splice(destination.index, 0, draggableId);

			// Update the task's columnID in allTasks and task's status to the corresponding column role
			if (state.allTasks[draggableId]) {
				console.log(
					state.columnIdAndRole[destination.droppableId],
					destination.droppableId
				);
				const columnRole = state.columnIdAndRole[destination.droppableId];
				state.allTasks[draggableId].status = columnRole;
				state.allTasks[draggableId].columnId = destination.droppableId;
				state.tasksInCurrentList[draggableId].status = columnRole;
			}

			console.log(
				`Moved task ${draggableId} from column ${source.droppableId} to column ${destination.droppableId}.`
			);
			console.log('This is movement between columns');
		},
	},
	extraReducers: (builder: ActionReducerMapBuilder<TaskState>) => {
		builder.addCase(
			setCurrentList,
			(state: TaskState, action: PayloadAction<List>) => {
				const { columnIds } = action.payload;
				const roles: ColumnRole[] = ['To Do', 'In Progress', 'Done', 'Pending'];
				state.tasksInCurrentList = {};
				state.taskIdsInCurrentList = [];
				// TODO: I think the key should be columnId
				Object.keys(state.taskIdsOrderInColumn).forEach((key: string) => {
					console.log('key', key);
					for (key in state.taskIdsOrderInColumn) {
						delete state.taskIdsOrderInColumn[key];
					}
					// state.taskIdsOrderInColumn[key] = [];
				});
				roles.forEach((role: ColumnRole, index: number) => {
					state.columnIdAndRole[columnIds[index]] = role;
				});

				// Populate data based on the current list's columns
				columnIds.map((columnId: ColumnId) => {
					state.taskIdsOrderInColumn[columnId] = [];
				});
				columnIds.forEach((columnId: ColumnId) => {
					// Filter tasks that belong to the current column
					const tasksInColumn = Object.values(state.allTasks).filter(
						(task: Task) => task.columnId === columnId
					);

					// Populate the tasks in current list and their IDs
					tasksInColumn.forEach((task) => {
						state.tasksInCurrentList[task.taskId] = task;
						if (!state.taskIdsOrderInColumn[columnId]) {
							state.taskIdsOrderInColumn[columnId] = [];
						}
						state.taskIdsOrderInColumn[columnId].push(task.taskId);
					});

					// Ensure task IDs in current list are unique and cover all tasks in the columns
					state.taskIdsInCurrentList = [
						...new Set([
							...state.taskIdsInCurrentList,
							...tasksInColumn.map((task) => task.taskId),
						]),
					];
				});
			}
		);
	},
});

export const {
	addTask,
	deleteTask,
	updateTask,
	taskMoveInColumn,
	taskMoveBetweenColumns,
} = taskSlice.actions;
export default taskSlice.reducer;
