import {
  createSlice,
  type ActionReducerMapBuilder,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  type ColumnId,
  type ColumnRole,
  type Column,
  type List,
  type TaskId,
  type ColumnState,
  type Task,
} from "../../types";
import { addListWithDefaultColumns, deleteList } from "../list/listSlice";
import { addTask, deleteTask } from "../task/taskSlice";
import { columnSliceInitialState } from "./columnData";
import type { DropResult } from "@hello-pangea/dnd";

export interface updateColumnPayload {
  columnId: ColumnId;
  taskId: TaskId;
}

export interface DropResultWithRole extends DropResult { 
  oldRole: ColumnRole;
  newRole: ColumnRole;
}

const columnSlice = createSlice({
  name: "column",
  initialState: columnSliceInitialState,
  reducers: {
    addColumns(
      state: ColumnState,
      action: PayloadAction<Record<ColumnId, Column>>,
    ) {
      Object.assign(state.allColumns, action.payload);
      console.log("Columns added:", action.payload);
    },
    updateColumn(
      state: ColumnState,
      action: PayloadAction<updateColumnPayload>,
    ) {
      const { columnId, taskId } = action.payload;
      const currentColumn = state.allColumns[columnId];
      currentColumn.taskIds.push(taskId);
    },
    updateCurrentColumnsOrder(
      state: ColumnState,
      action: PayloadAction<DropResult>,
    ) {
      const { source, destination, draggableId } = action.payload;
      if (!(draggableId in state.allColumns)) {
        throw new Error("The column you want to move does not exist");
      }
      if (!destination) {
        console.log("No destination");
        return;
      }
      if (source.droppableId !== destination.droppableId) {
        console.log("Column only has one droppable area");
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
      action: PayloadAction<DropResult>,
    ) {
      const { source, destination, draggableId } = action.payload;
      console.log(`Source: ${source.droppableId}`);
      console.log(`Destination: ${destination?.droppableId}`);
      console.log(`Draggable ID: ${draggableId}`);
      const sourceColumn = state.allColumns[source.droppableId];

      const destinationColumn = state.allColumns[destination!.droppableId];
      if (!(sourceColumn.columnId in state.allColumns)) {
        throw new Error("The source column does not exit in allColumns");
      }
      if (!(destinationColumn.columnId in state.allColumns)) {
        throw new Error("The destination column does not exit in allColumns");
      }
      if (
        !state.allColumns[sourceColumn.columnId].taskIds.find(
          (taskId: TaskId) => taskId === draggableId,
        )
      ) {
        throw new Error(
          "The task you want to move does not exits in the source column",
        );
      }

      //  This is unnecessary. I only add this to suppress typescript error as onDragEnd already make sure that source and destination are defined before dispatching the action
      if (!destination) {
        console.log("No destination");
        return;
      }
      const oldIndex = source.index;
      const newIndex = destination.index;
      const [remove] = state.allColumns[source.droppableId].taskIds.splice(
        oldIndex,
        1,
      );
      state.allColumns[destination.droppableId].taskIds.splice(
        newIndex,
        0,
        remove,
      );
    },
    updateTaskOwner(
      state: ColumnState,
      action: PayloadAction<DropResultWithRole>,
    ) {
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
      .addCase(
        addListWithDefaultColumns,
        (state: ColumnState, action: PayloadAction<List>) => {
          const roles: ColumnRole[] = [
            "To Do",
            "In Progress",
            "Done",
            "Pending",
          ];
          const { columnIdsOrder: columnIds, listId } = action.payload;
          roles.forEach((role: ColumnRole, index: number) => {
            const columnId = columnIds[index]; // Make sure columnIds exist and are correctly indexed
            state.allColumns[columnId] = {
              columnId,
              role: role,
              taskIds: [],
              listId,
            };
          });
        },
      )
      .addCase(
        deleteList,
        (state: ColumnState, action: PayloadAction<List>) => {
          const { columnIdsOrder: columnIds } = action.payload;
          columnIds.forEach((columnId: ColumnId) => {
            delete state.allColumns[columnId];
          });
        },
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
            1,
          );
          state.columnsInCurrentList[columnId].taskIds.splice(
            state.columnsInCurrentList[columnId].taskIds.indexOf(taskId),
            1,
          );
          console.log("Task deleted:", taskId);
        },
      );
  },
});

export const {
  addColumns,
  updateColumn,
  updateCurrentColumnsOrder,
  updateTasksOrderInColumn,
  updateTaskOwner,
} = columnSlice.actions;
export default columnSlice.reducer;
