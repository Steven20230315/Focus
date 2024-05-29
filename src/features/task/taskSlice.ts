import { createSlice, type PayloadAction, type ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { type TaskId, type Task, type ColumnId, type Column, type ColumnRole } from '../../types';
import { updateTaskOwner } from '../column/columnSlice';
import { DropResult } from '@hello-pangea/dnd';
import { db } from '../../firebase/firebase-config';
import { collection, runTransaction, addDoc, doc, query, where, getDocs } from 'firebase/firestore';
// TODO: This is only a temporary type definition. For testing purposes.

type CreateTaskPayload = Omit<Task, 'taskId'>;

export const fetchTasks = createAsyncThunk<Record<TaskId, Task>, string>(
  'task/fetchTasks',
  async (userId, { rejectWithValue }) => {
    try {
      const taskCollectionRef = collection(db, 'tasks');
      const q = query(taskCollectionRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      // Convert querySnapshot to an Record of Task objects
      const fetchedTasks = querySnapshot.docs.reduce(
        (acc, doc) => {
          const taskData = doc.data() as Omit<Task, 'taskId'>;
          acc[doc.id] = { ...taskData, taskId: doc.id };
          return acc;
        },
        {} as Record<TaskId, Task>,
      );
      return fetchedTasks;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createTask = createAsyncThunk<Task, CreateTaskPayload>(
  'task/createTask',
  async (task: CreateTaskPayload, { rejectWithValue }) => {
    const columnRef = doc(db, 'columns', task.columnId);
    const taskCollectionRef = collection(db, 'tasks');
    console.log(task);
    try {
      return await runTransaction(db, async (transaction) => {
        console.log('Creating task: ', task);
        const newTaskRef = await addDoc(taskCollectionRef, task);
        console.log(newTaskRef.id);
        console.log(newTaskRef);
        const columnSnap = await transaction.get(columnRef);
        if (!columnSnap.exists()) {
          throw new Error('Column not found');
        }

        const columnData = columnSnap.data() as Omit<Column, 'columnId'>;
        const updatedTaskIds = [...columnData.taskIds, newTaskRef.id];
        console.log('ready to update column');
        transaction.update(columnRef, { taskIds: updatedTaskIds });

        return { ...task, taskId: newTaskRef.id } as Task;
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

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
    builder
      .addCase(updateTaskOwner, (state: TaskState, action: PayloadAction<DropResult>) => {
        const { destination, draggableId } = action.payload;
        if (!destination) return;
        const [columnRole, columnId] = destination.droppableId.split('-') as [ColumnRole, ColumnId];
        console.log(columnRole, columnId);
        state.allTasks[draggableId].columnId = columnId;
        state.allTasks[draggableId].status = columnRole;
      })
      .addCase(createTask.fulfilled, (state: TaskState, action: PayloadAction<Task>) => {
        const { taskId } = action.payload;
        state.allTasks[taskId] = action.payload;
        console.log('Task created successfully');
      })
      .addCase(createTask.rejected, (state, action) => {
        console.log(state.allTasks);
        console.log(action.error);
        console.log('Task creation failed');
      })
      .addCase(createTask.pending, () => {
        console.log('Creating task...');
      })
      .addCase(fetchTasks.fulfilled, (state: TaskState, action: PayloadAction<Record<TaskId, Task>>) => {
        state.allTasks = action.payload;
        console.log('Tasks fetched successfully');
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        console.log(action.error);
        console.log(state);
      })
      .addCase(fetchTasks.pending, () => {
        console.log('Fetching tasks...');
      });
  },
});

export const { addTask, deleteTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
