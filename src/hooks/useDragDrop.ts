import { useDispatch } from 'react-redux';
import { type DropResult } from '@hello-pangea/dnd';
import { updateListsOrder } from '../features/list/listSlice';
import { updateTaskOwner } from '../features/column/columnSlice';
import { updateTasksOrderInColumn } from '../features/column/columnSlice';
import { updateColumnsOrderInList } from '../features/list/listSlice';

// Function to validate drag and drop results before dispatching. In development mode, it will throw an error.
// NOTE: This function only check if draggableId is defined, It does not check whether draggableId exists in the state. This is done in the reducer.
const validateDragResult = (result: DropResult) => {
  const { destination, source, draggableId } = result;
  if (!draggableId) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('draggableId is undefined');
    } else {
      return false;
    }
  }
  if (!source) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('source is undefined');
    } else {
      return false;
    }
  }
  if (!destination) {
    console.log('destination is undefined');
    return false;
  } else if (!destination.droppableId) {
    console.log('destination.droppableId is undefined');
    return false;
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
      if (source.droppableId === 'sidebar') {
        console.debug('Update list order in sidebar');
        dispatch(updateListsOrder(result));
      } else if (result.type === 'column') {
        console.debug('Update column order in view');
        dispatch(updateColumnsOrderInList(result));
      } else {
        console.debug('Update tasks order in the same column');
        dispatch(updateTasksOrderInColumn(result));
      }
    } else {
      console.debug('Update which column the task is in');

      dispatch(updateTaskOwner(result));
    }
  };

  return onDragEnd;
};
