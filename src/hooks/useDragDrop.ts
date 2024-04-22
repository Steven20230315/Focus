import { useDispatch } from "react-redux";
import { type DropResult } from "@hello-pangea/dnd";
import { updateListsOrder } from "../features/list/listSlice";
import { updateCurrentColumnsOrder } from "../features/column/columnSlice";
import {
  taskMoveInColumn,
  taskMoveBetweenColumns,
} from "../features/task/taskSlice";
// Function to validate drag and drop results before dispatching. In development mode, it will throw an error.
const validateDragResult = (result: DropResult) => {
  const { destination, source, draggableId } = result;
  if (!draggableId) {
    if (process.env.NODE_ENV === "development") {
      throw new Error("draggableId is undefined");
    } else {
      return false;
    }
  }
  if (!source) {
    if (process.env.NODE_ENV === "development") {
      throw new Error("source is undefined");
    } else {
      return false;
    }
  }
  if (!destination) {
    if (process.env.NODE_ENV === "development") {
      // Destination is undefined is not an error. Simply means the draggable item is dropped outside the droppable area. Do not throw an error.
      console.log("destination is undefined");
    } else {
      return false;
    }
  }
  return true;
};

export const useDragDrop = () => {
  const dispatch = useDispatch();

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!validateDragResult(result)) return;

    // result is validated. destination can not be undefined.
    if (source.droppableId === destination!.droppableId) {
      // Handles reordering of lists in sidebar, columns in view, or tasks in the same column
      switch (source.droppableId) {
        case "sidebar":
          console.debug("Update list order in sidebar");
          dispatch(updateListsOrder(result));
          break;
        case "view":
          console.debug("Update columns order in view");
          dispatch(updateCurrentColumnsOrder(result));
          break;
        default:
          console.debug("Update tasks order in the same column");
          dispatch(taskMoveInColumn(result));
          break;
      }
    } else {
      // Not just reordering, but change ownership of a task
      console.debug("Update which column the task is in");
      dispatch(taskMoveBetweenColumns(result));
    }
  };

  return onDragEnd;
};
