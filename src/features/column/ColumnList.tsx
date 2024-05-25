import { Droppable, type DroppableProvided } from '@hello-pangea/dnd';
import type { ColumnId } from '../../types';
import ColumnItem from './ColumnItem';
import { selectColumnIdsInCurrentList } from './columnSelector';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function ColumnList() {
  const currentListId = useSelector((state: RootState) => state.list.currentListId);
  const columnIds = useSelector(selectColumnIdsInCurrentList);
  // TODO: Add error handling
  if (!currentListId) {
    console.log('currentListId is null');
    return null;
  }
  if (!columnIds) {
    console.log('columnIds is null');
    return null;
  }
  return (
    <>
      <Droppable droppableId={currentListId} type="column">
        {(provided: DroppableProvided) => (
          <div
            // className="min-w-1/2 flex  min-w-[320px] max-w-[1080px] flex-col gap-1 self-center sm:min-w-[480px] md:min-w-[600px] md:gap-3 lg:min-w-[800px] xl:gap-5"
            className="flex min-w-[80%] flex-col gap-2"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {columnIds.map((columnId: ColumnId, index: number) => (
              <ColumnItem key={columnId} columnId={columnId} index={index} />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
}
