import { createSlice, type PayloadAction, type ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { type TaskId, type Task, type ColumnId, type ColumnRole } from '../../types';
import { updateTaskOwner } from '../column/columnSlice';
import { DropResultWithRole } from '../column/columnSlice';
// TODO: This is only a temporary type definition. For testing purposes.

interface TaskState {
  allTasks: Record<TaskId, Task>;
  tasksInCurrentList: Record<TaskId, Task>;
  taskIdsInCurrentList: TaskId[];
  taskIdsOrderInColumn: Record<ColumnId, TaskId[]>;
  columnIdAndRole: Record<ColumnId, ColumnRole>;
}

export type DeleteTaskPayload = {
  columnId: ColumnId;
  taskId: TaskId;
};

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
    deleteTask: (state: TaskState, action: PayloadAction<DeleteTaskPayload>) => {
      if (!(action.payload.taskId in state.allTasks)) {
        throw new Error('The task you want to delete does not exist');
      } else {
        delete state.allTasks[action.payload.taskId];
        delete state.tasksInCurrentList[action.payload.taskId];
      }
    },
    // TODO: Make a type that is partial of task instead of task id
    updateTask: (state: TaskState, action: PayloadAction<Partial<Task> & { taskId: TaskId }>) => {
      if (!(action.payload.taskId in state.allTasks)) {
        throw new Error('The task you want to update does not exist');
      } else {
        console.log("I'll think about it later");
      }
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<TaskState>) => {
    builder.addCase(updateTaskOwner, (state: TaskState, action: PayloadAction<DropResultWithRole>) => {
      const { destination, draggableId, oldRole, newRole } = action.payload;
      console.log(`Task old status: ${oldRole}`);
      console.log(`Task new status: ${newRole}`);
      state.allTasks[draggableId].columnId = destination!.droppableId;
      state.allTasks[draggableId].status = newRole;
    });
  },
});

export const { addTask, deleteTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
