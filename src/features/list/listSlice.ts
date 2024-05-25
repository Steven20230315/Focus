import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { type List, type ListId, ListsState, type UpdateListTitlePayload, type Column } from '../../types';
import { type DropResult } from '@hello-pangea/dnd';
import { db } from '../../firebase/firebase-config';
import { getDocs, collection, addDoc, query, where, doc, runTransaction } from 'firebase/firestore';
import { createColumn } from '../column/columnSlice';
// Project slice is responsible for managing projects (CRUD operations)
// Initial state for projects

export const deleteList = createAsyncThunk<List, List>('list/deleteList', async (list: List, { rejectWithValue }) => {
  const columnsRef = collection(db, 'columns');
  const taskRef = collection(db, 'tasks');
  const listDocRef = doc(db, 'lists', list.listId);
  const q = query(columnsRef, where('listId', '==', list.listId));
  const qTask = query(taskRef, where('listId', '==', list.listId));
  try {
    return await runTransaction(db, async (transaction) => {
      const querySnapshot = await getDocs(q);
      const querySnapshotTask = await getDocs(qTask);
      querySnapshotTask.forEach((doc) => {
        transaction.delete(doc.ref);
      });
      querySnapshot.forEach((doc) => {
        transaction.delete(doc.ref);
      });
      transaction.delete(listDocRef);

      return list;
    });
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchLists = createAsyncThunk<Record<ListId, List>, string>(
  'list/fetchLists',
  async (userId, { rejectWithValue }) => {
    // TODO: Create a userSlice to manage users.Check if the user is logged in.
    try {
      const listCollectionRef = collection(db, 'lists');
      const q = query(listCollectionRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      // Convert querySnapshot to an Record of List objects
      const fetchedLists = querySnapshot.docs.reduce(
        (acc, doc) => {
          const listData = doc.data() as Omit<List, 'listId'>;
          acc[doc.id] = { ...listData, listId: doc.id };
          return acc;
        },
        {} as Record<ListId, List>,
      );
      return fetchedLists;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createList = createAsyncThunk<List, { title: string; userId: string }>(
  'list/createList',
  async ({ title, userId }, { rejectWithValue }) => {
    try {
      const ListCollectionRef = collection(db, 'lists');
      const newList = await addDoc(ListCollectionRef, { title, userId, columnIds: [] });
      return { title, listId: newList.id, columnIds: [], userId };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState: ListsState = {
  status: 'idle',
  allLists: {},
  listsOrder: [],
  currentListId: null,
  isSidebarOpen: true,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addListWithDefaultColumns: (state: ListsState, action: PayloadAction<List>) => {
      // When a new project is created, it has four default columns
      // Type Project has a columnIds field. This field is an array of columnIds. It will be used to create default columns in columnSlice(extraReducers)
      const newList = action.payload;
      const newListId = newList.listId;
      state.allLists[newListId] = newList;
      state.listsOrder.push(newList.listId);
    },
    updateCurrentList: (state: ListsState, action: PayloadAction<List>) => {
      if (!(action.payload.listId in state.allLists)) {
        throw new Error('The project you want to update does not exist');
      } else {
        state.allLists[action.payload.listId] = action.payload;
      }
    },
    // ******************************************************************************************************
    // TODO: Add more comment here. Below is code for managing how lists are displayed
    // ******************************************************************************************************
    setCurrentList: (state: ListsState, action: PayloadAction<ListId>) => {
      state.currentListId = action.payload;
    },
    updateListsOrder: (state: ListsState, action: PayloadAction<DropResult>) => {
      const { source, destination, draggableId } = action.payload;
      if (!(draggableId in state.allLists)) {
        throw new Error('The list you want to move does not exist');
      }
      if (!destination) {
        console.log('No destination');
        return;
      }
      if (source.droppableId !== destination.droppableId) {
        console.log('List only has one droppable area');
      }
      if (source.droppableId === destination.droppableId) {
        const oldIndex = source.index;
        const newIndex = destination.index;
        state.listsOrder.splice(oldIndex, 1);
        state.listsOrder.splice(newIndex, 0, draggableId);
        console.log('List reorder success');
      } else {
        console.log('List reorder failed');
        console.log('Unexpected case. Need to figure out what I missed here');
      }
    },
    updateColumnsOrderInList: (state: ListsState, action: PayloadAction<DropResult>) => {
      // onDragEnd function ensure 1. source, destination and draggableId are provided 2. source.droppableId and destination.droppableId are the same
      // What onDragEnd does not ensure is droppableId is valid in allLists, and the draggableId is in allLists[source.droppableId].columnIds
      const { source, destination, draggableId } = action.payload;
      const sourceListId = source.droppableId;
      if (!(sourceListId in state.allLists)) {
        throw new Error(
          'The droppableId is not a valid list id, it does not exist in allLists. This should not happen',
        );
      }
      // Check if the draggableId is in the columnIds of the sourceList
      if (!state.allLists[sourceListId].columnIds.includes(draggableId)) {
        throw new Error(
          'The draggableId is not a valid column id, it does not exist in allLists[sourceListId].columnIds. This should not happen',
        );
      }

      // Ready to update allLists
      const [remove] = state.allLists[sourceListId].columnIds.splice(source.index, 1);
      state.allLists[sourceListId].columnIds.splice(destination!.index, 0, remove);
    },
    toggleSidebar: (state: ListsState, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    updateListTitle: (state: ListsState, action: PayloadAction<UpdateListTitlePayload>) => {
      const list = state.allLists[action.payload.listId];
      if (!list) {
        throw new Error('The list you want to update does not exist');
      }
      list.title = action.payload.title;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        console.log('Fetching lists...');
        state.status = 'loading';
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // If action.payload is an empty object, don't use it to initialize the state
        if (Object.keys(action.payload).length === 0) return;
        state.allLists = { ...action.payload };
        state.listsOrder = Object.keys(action.payload);
        state.currentListId = state.listsOrder[0];
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error);
      })
      .addCase(createList.fulfilled, (state, action) => {
        console.log('Added a new list');
        const newList: List = action.payload;
        state.allLists[newList.listId] = newList;
        state.listsOrder.push(newList.listId);
        console.log('Before setting currentListId:', state.currentListId);
        console.log('State allLists:', state.allLists);
        console.log('State listsOrder:', state.listsOrder);

        if (state.currentListId === null) {
          state.currentListId = newList.listId;
          console.log('Set currentListId to:', state.currentListId);
        }

        // Additional logging for debugging
        console.log('After setting currentListId:', state.currentListId);
      })
      .addCase(createList.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error);
      })
      .addCase(createList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createColumn.fulfilled, (state, action: PayloadAction<Column>) => {
        const { listId, columnId } = action.payload;
        if (!(listId in state.allLists)) {
          throw new Error('The list you want to update does not exist');
        }
        state.allLists[listId].columnIds.push(columnId);
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        const deleteDlistId = action.payload.listId;
        if (!(deleteDlistId in state.allLists)) {
          throw new Error('The list you want to delete does not exist');
        }
        state.listsOrder = state.listsOrder.filter((listId) => listId !== deleteDlistId);
        // If the deleted list is the current list, change the current list to the first list. Otherwise, the app will crash.
        if (state.currentListId === deleteDlistId) {
          state.currentListId = state.listsOrder[0];
        }
        delete state.allLists[deleteDlistId];
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error);
      })
      .addCase(deleteList.pending, (state) => {
        state.status = 'loading';
      });
  },
});

export const {
  addListWithDefaultColumns,
  updateCurrentList,
  setCurrentList,
  updateListsOrder,
  updateColumnsOrderInList,
  toggleSidebar,
  updateListTitle,
} = projectSlice.actions;
export default projectSlice.reducer;
