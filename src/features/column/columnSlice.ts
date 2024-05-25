import { createSlice, type ActionReducerMapBuilder, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  type ColumnId,
  type ColumnRole,
  type Column,
  type List,
  type TaskId,
  type ColumnState,
  type Task,
} from '../../types';
import { deleteList } from '../list/listSlice';
import { addTask, createTask, deleteTask, type DeleteTaskPayload } from '../task/taskSlice';
import { db } from '../../firebase/firebase-config';
import { collection, addDoc, query, where, getDocs, runTransaction, doc } from 'firebase/firestore';
import type { DropResult } from '@hello-pangea/dnd';

type CreateColumnPayload = Omit<Column, 'columnId' | 'taskIds'>;

export const createColumn = createAsyncThunk<Column, CreateColumnPayload>(
  'column/createColumn',
  async (column: CreateColumnPayload, { rejectWithValue }) => {
    const columnCollectionRef = collection(db, 'columns');
    const listRef = doc(db, 'lists', column.listId);
    try {
      return await runTransaction(db, async (transaction) => {
        const newColumnRef = await addDoc(columnCollectionRef, { ...column, taskIds: [] });

        const listSnap = await transaction.get(listRef);
        if (!listSnap.exists()) {
          throw new Error('List not found');
        } else {
          console.log('List exists');
        }

        const listData = listSnap.data() as Omit<List, 'listId'>;
        const updatedColumnIds = [...listData.columnIds, newColumnRef.id];

        transaction.update(listRef, { columnIds: updatedColumnIds });
        const completedColumn: Column = {
          ...column,
          columnId: newColumnRef.id,
          taskIds: [],
        };

        console.log('completedColumn', completedColumn);
        // TypeScript can't infer the actual contents of the object being return from the transaction. If you manually cast the return value as type Column
        // return { ...column, columnId: newColumnRef.id } as Column;
        return completedColumn;
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchColumnsByUserId = createAsyncThunk<Record<ColumnId, Column>, string>(
  'column/fetchColumnsByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const columnCollectionRef = collection(db, 'columns');
      const q = query(columnCollectionRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      // Convert querySnapshot to an Record of Column objects
      const fetchedColumns = querySnapshot.docs.reduce(
        (acc, doc) => {
          const columnData = doc.data() as Omit<Column, 'columnId'>;
          acc[doc.id] = { ...columnData, columnId: doc.id };
          return acc;
        },
        {} as Record<ColumnId, Column>,
      );
      console.log('fetchedColumns', fetchedColumns);
      return fetchedColumns;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export interface updateColumnPayload {
  columnId: ColumnId;
  taskId: TaskId;
}

export interface DropResultWithRole extends DropResult {
  oldRole: ColumnRole;
  newRole: ColumnRole;
}

const initialState: ColumnState = {
  allColumns: {},
  status: 'idle',
};

const columnSlice = createSlice({
  name: 'column',
  initialState: initialState,
  reducers: {
    addColumns(state: ColumnState, action: PayloadAction<Record<ColumnId, Column>>) {
      Object.assign(state.allColumns, action.payload);
    },
    updateColumn(state: ColumnState, action: PayloadAction<updateColumnPayload>) {
      const { columnId, taskId } = action.payload;
      const currentColumn = state.allColumns[columnId];
      currentColumn.taskIds.push(taskId);
    },
    updateTasksOrderInColumn(state: ColumnState, action: PayloadAction<DropResult>) {
      const { source, destination, draggableId } = action.payload;
      const sourceColumn = state.allColumns[source.droppableId];

      const destinationColumn = state.allColumns[destination!.droppableId];
      if (!(sourceColumn.columnId in state.allColumns)) {
        throw new Error('The source column does not exit in allColumns');
      }
      if (!(destinationColumn.columnId in state.allColumns)) {
        throw new Error('The destination column does not exit in allColumns');
      }
      if (!state.allColumns[sourceColumn.columnId].taskIds.find((taskId: TaskId) => taskId === draggableId)) {
        throw new Error('The task you want to move does not exits in the source column');
      }

      //  This is unnecessary. I only add this to suppress typescript error as onDragEnd already make sure that source and destination are defined before dispatching the action
      if (!destination) {
        console.log('No destination');
        return;
      }
      const oldIndex = source.index;
      const newIndex = destination.index;
      const [remove] = state.allColumns[source.droppableId].taskIds.splice(oldIndex, 1);
      state.allColumns[destination.droppableId].taskIds.splice(newIndex, 0, remove);
    },
    updateTaskOwner(state: ColumnState, action: PayloadAction<DropResultWithRole>) {
      const { source, destination } = action.payload;
      const currentColumn = state.allColumns[source.droppableId];
      const newColumn = state.allColumns[destination!.droppableId];
      const [remove] = currentColumn.taskIds.splice(source.index, 1);
      newColumn.taskIds.push(remove);
      // newColumn.taskIds.splice(destination!.index, 0, remove);
    },
  },
  // I think I might remove this. I'll just use a utility function to create project and columns at the same time. Instead of passing more Info in the payload.
  extraReducers: (builder: ActionReducerMapBuilder<ColumnState>) => {
    builder
      .addCase(deleteList.fulfilled, (state: ColumnState, action: PayloadAction<List>) => {
        const { columnIds: columnIds } = action.payload;
        columnIds.map((columnId: ColumnId) => {
          delete state.allColumns[columnId];
        });
        columnIds.forEach((columnId: ColumnId) => {
          delete state.allColumns[columnId];
        });
      })
      .addCase(addTask, (state: ColumnState, action: PayloadAction<Task>) => {
        const { columnId, taskId } = action.payload;
        state.allColumns[columnId].taskIds.push(taskId);
      })
      .addCase(deleteTask, (state: ColumnState, action: PayloadAction<DeleteTaskPayload>) => {
        const { columnId, taskId } = action.payload;
        const deleteTaskIdFromThisColumn = state.allColumns[columnId];
        deleteTaskIdFromThisColumn.taskIds.splice(deleteTaskIdFromThisColumn.taskIds.indexOf(taskId), 1);
      })
      .addCase(createColumn.fulfilled, (state: ColumnState, action: PayloadAction<Column>) => {
        const { columnId } = action.payload;
        state.allColumns[columnId] = action.payload;
      })
      .addCase(createColumn.rejected, (state: ColumnState, action) => {
        state.status = 'failed';
        console.log(action.error);
      })
      .addCase(createColumn.pending, (state) => {
        state.status = 'loading';
        console.log('Creating column...');
      })
      .addCase(
        fetchColumnsByUserId.fulfilled,
        (state: ColumnState, action: PayloadAction<Record<ColumnId, Column>>) => {
          console.log(action.payload);
          if (Object.keys(action.payload).length === 0) return;
          state.allColumns = { ...state.allColumns, ...action.payload };
          console.log('Column fetched');
        },
      )
      .addCase(fetchColumnsByUserId.rejected, (state: ColumnState, action) => {
        state.status = 'failed';
        console.log(action.error);
      })
      .addCase(fetchColumnsByUserId.pending, (state) => {
        state.status = 'loading';
        console.log('Fetching columns by userId...');
      })
      .addCase(createTask.fulfilled, (state: ColumnState, action: PayloadAction<Task>) => {
        const { columnId } = action.payload;
        state.allColumns[columnId].taskIds.push(action.payload.taskId);
      });
  },
});

export const { addColumns, updateColumn, updateTasksOrderInColumn, updateTaskOwner } = columnSlice.actions;
export default columnSlice.reducer;
