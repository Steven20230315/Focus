import { Droppable, type DroppableProvided } from '@hello-pangea/dnd';
import type { ColumnId } from '../../types';
import ColumnItem from './ColumnItem';
import { selectColumnIdsInCurrentList } from './columnSelector';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function ColumnList() {
  const currentListId = useSelector((state: RootState) => state.list.currentListId);
  const columnIds = useSelector(selectColumnIdsInCurrentList);
  return (
    <>
      {/* <Droppable droppableId={columnsInCurrentList[0].listId} type="column"> */}
      <Droppable droppableId={currentListId} type="column">
        {(provided: DroppableProvided) => (
          <div className="flex flex-col gap-5" {...provided.droppableProps} ref={provided.innerRef}>
            {columnIds.map((columnId: ColumnId, index: number) => (
              <ColumnItem key={columnId} columnId={columnId} index={index} />
            ))}
            {/* {columnsInCurrentList.map((column: Column, index: number) => (
              <ColumnItem key={column.columnId} column={column} index={index} />
            ))} */}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
}
