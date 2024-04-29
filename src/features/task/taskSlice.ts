import { createSlice, type PayloadAction, type ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { type TaskId, type Task, type ColumnId } from '../../types';
import { updateTaskOwner } from '../column/columnSlice';
import { DropResultWithRole } from '../column/columnSlice';
// TODO: This is only a temporary type definition. For testing purposes.

interface TaskState {
  allTasks: Record<TaskId, Task>;
}

export type UpdateTaskPayload = Partial<Task> & {
  taskId: TaskId;
};
export type DeleteTaskPayload = {
  columnId: ColumnId;
  taskId: TaskId;
};

const initialState: TaskState = {
  allTasks: {},
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state: TaskState, action: PayloadAction<Task>) => {
      const { taskId } = action.payload;
      state.allTasks[taskId] = action.payload;
      // Add task ID to the appropriate column's order array
      // How to update tasks order in column?
    },
    deleteTask: (state: TaskState, action: PayloadAction<DeleteTaskPayload>) => {
      if (!(action.payload.taskId in state.allTasks)) {
        throw new Error('The task you want to delete does not exist');
      } else {
        delete state.allTasks[action.payload.taskId];
      }
    },
    updateTask: (state: TaskState, action: PayloadAction<UpdateTaskPayload>) => {
      const { taskId } = action.payload;
      if (!state.allTasks[taskId]) {
        throw new Error('The task you want to update does not exist');
      }
      // Only update the fields that are present in the payload, preserving others
      state.allTasks[taskId] = { ...state.allTasks[taskId], ...action.payload };
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<TaskState>) => {
    builder.addCase(updateTaskOwner, (state: TaskState, action: PayloadAction<DropResultWithRole>) => {
      const { destination, draggableId, newRole } = action.payload;
      state.allTasks[draggableId].columnId = destination!.droppableId;
      state.allTasks[draggableId].status = newRole;
    });
  },
});

export const { addTask, deleteTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
