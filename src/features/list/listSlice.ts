import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type List, type ListId } from "../../types";
import { type DropResult } from "@hello-pangea/dnd";
// Project slice is responsible for managing projects (CRUD operations)
interface ListsState {
  allLists: Record<ListId, List>;
  listsOrder: ListId[];
  currentList: List;
}

// Initial state for projects
const initialState: ListsState = {
  allLists: {
    "cad747f0-671f-4687-8a2a-a5499f3f65b8": {
      title: "List 1",
      listId: "cad747f0-671f-4687-8a2a-a5499f3f65b8",
      columnIds: [
        "68c83c43-5b6c-4ddd-8718-9504d724b19e",
        "a0ef1554-c6d1-447a-8d6d-09a2e475e92d",
        "3dbbb74b-9988-4c77-ad3d-90ed04a03894",
        "dd02393d-82ac-4105-8ca6-e4fa282c2321",
      ],
    },
    "e8b1fb51-56fa-4f02-b2cf-3e7faa02e9a7": {
      title: "List 2",
      listId: "e8b1fb51-56fa-4f02-b2cf-3e7faa02e9a7",
      columnIds: [
        "3d95854c-c268-4941-85df-2132ceac0513",
        "243473a7-7eb9-4e66-bd52-6d2a34214a8d",
        "dd3e02e6-c386-4de7-b7e2-f3a72fee456f",
        "5f4d1e8e-8e7e-4f6c-8f2d-0e4e9f9f9f9f",
      ],
    },
    "6d80ab43-79fc-4914-82fc-eb7f0f8562ec": {
      title: "List 3",
      listId: "6d80ab43-79fc-4914-82fc-eb7f0f8562ec",
      columnIds: [
        "f00e6163-7972-4842-8b81-225061cb3ae8",
        "c45d4737-4ced-46c7-ad2b-25e7b01fbd88",
        "205a1c14-9ccd-44f5-9905-518c8e6a9250",
        "ae08d0a3-5c97-4071-8e53-ad7995e0a336",
      ],
    },
  },
  listsOrder: [
    "cad747f0-671f-4687-8a2a-a5499f3f65b8",
    "e8b1fb51-56fa-4f02-b2cf-3e7faa02e9a7",
    "6d80ab43-79fc-4914-82fc-eb7f0f8562ec",
  ],
  currentList: {
    title: "List 1",
    listId: "cad747f0-671f-4687-8a2a-a5499f3f65b8",
    columnIds: [
      "68c83c43-5b6c-4ddd-8718-9504d724b19e",
      "a0ef1554-c6d1-447a-8d6d-09a2e475e92d",
      "3dbbb74b-9988-4c77-ad3d-90ed04a03894",
      "dd02393d-82ac-4105-8ca6-e4fa282c2321",
    ],
  },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    addListWithDefaultColumns: (
      state: ListsState,
      action: PayloadAction<List>,
    ) => {
      // When a new project is created, it has four default columns
      // Type Project has a columnIds field. This field is an array of columnIds. It will be used to create default columns in columnSlice(extraReducers)
      const newList = action.payload;
      const newListId = newList.listId;
      state.allLists[newListId] = newList;
      state.listsOrder.push(newList.listId);
    },
    deleteList: (state: ListsState, action: PayloadAction<List>) => {
      const listId = action.payload.listId;
      if (!(listId in state.allLists)) {
        throw new Error("The list you want to delete does not exist");
      } else {
        delete state.allLists[listId];
      }
    },
    updateCurrentList: (state: ListsState, action: PayloadAction<List>) => {
      if (!(action.payload.listId in state.allLists)) {
        throw new Error("The project you want to update does not exist");
      } else {
        state.allLists[action.payload.listId] = action.payload;
      }
    },
    // ******************************************************************************************************
    // TODO: Add more comment here. Below is code for managing how lists are displayed
    // ******************************************************************************************************
    setCurrentList: (state: ListsState, action: PayloadAction<List>) => {
      state.currentList = action.payload;
    },
    updateListsOrder: (
      state: ListsState,
      action: PayloadAction<DropResult>,
    ) => {
      const { source, destination, draggableId } = action.payload;
      if (!(draggableId in state.allLists)) {
        throw new Error("The list you want to move does not exist");
      }
      if (!destination) {
        console.log("No destination");
        return;
      }
      if (source.droppableId !== destination.droppableId) {
        console.log("List only has one droppable area");
      }
      if (source.droppableId === destination.droppableId) {
        const oldIndex = source.index;
        const newIndex = destination.index;
        state.listsOrder.splice(oldIndex, 1);
        state.listsOrder.splice(newIndex, 0, draggableId);
        console.log("List reorder success");
      } else {
        console.log("List reorder failed");
        console.log("Unexpected case. Need to figure out what I missed here");
      }
    },
    updateColumnsOrderInList: (
      state: ListsState,
      action: PayloadAction<DropResult>,
    ) => {
      // onDragEnd function ensure 1. source, destination and draggableId are provided 2. source.droppableId and destination.droppableId are the same
      // What onDragEnd does not ensure is droppableId is valid in allLists, and the draggableId is in allLists[source.droppableId].columnIds
      const { source, destination, draggableId } = action.payload;
      const sourceListId = source.droppableId;
      if (!(sourceListId in state.allLists)) {
        throw new Error(
          "The droppableId is not a valid list id, it does not exist in allLists. This should not happen",
        );
      }
      // Check if the draggableId is in the columnIds of the sourceList
      if (!state.allLists[sourceListId].columnIds.includes(draggableId)) {
        throw new Error(
          "The draggableId is not a valid column id, it does not exist in allLists[sourceListId].columnIds. This should not happen",
        );
      }

      // Ready to update allLists
      const [remove] = state.allLists[sourceListId].columnIds.splice(
        source.index,
        1,
      );
      state.allLists[sourceListId].columnIds.splice(
        destination!.index,
        0,
        remove,
      );
    },
  },
});

export const {
  addListWithDefaultColumns,
  deleteList,
  updateCurrentList,
  setCurrentList,
  updateListsOrder,
  updateColumnsOrderInList,
} = projectSlice.actions;
export default projectSlice.reducer;
