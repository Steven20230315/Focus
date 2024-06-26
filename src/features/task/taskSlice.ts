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
  allTasks: {
    '44f64636-1240-47df-af28-69a2f0666358': {
      taskId: '44f64636-1240-47df-af28-69a2f0666358',
      title: 'Task 1',
      columnId: '68c83c43-5b6c-4ddd-8718-9504d724b19e',
      listId: 'cad747f0-671f-4687-8a2a-a5499f3f65b8',
      status: 'To Do',
      priority: 'Low',
      dueDate: '2022-01-21',
      timeSpend: 0,
      pomodoroLength: 15,
    },
    '6b24381f-ac0f-4e6f-9fef-c63be4fb6e9b': {
      taskId: '6b24381f-ac0f-4e6f-9fef-c63be4fb6e9b',
      title: 'Task 1',
      columnId: '68c83c43-5b6c-4ddd-8718-9504d724b19e',
      listId: 'cad747f0-671f-4687-8a2a-a5499f3f65b8',
      status: 'To Do',
      priority: 'Normal',
      dueDate: '2024-07-07',
      timeSpend: 1500,
      pomodoroLength: 15,
    },
    '499a2cac-d874-4e30-bc36-d800449ccbcc': {
      taskId: '499a2cac-d874-4e30-bc36-d800449ccbcc',
      title: 'Task 1',
      columnId: '68c83c43-5b6c-4ddd-8718-9504d724b19e',
      listId: 'cad747f0-671f-4687-8a2a-a5499f3f65b8',
      status: 'To Do',
      priority: 'Urgent',
      dueDate: '2025-01-14',
      timeSpend: 3000,
      pomodoroLength: 15,
    },
  },
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
