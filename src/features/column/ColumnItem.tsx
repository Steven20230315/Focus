import {
  Draggable,
  type DraggableProvided,
  Droppable,
  type DroppableProvided,
} from '@hello-pangea/dnd';
import { type Column } from '../../types';
import TaskList from '../task/TaskList';

type ColumnDisplayProps = {
  index: number;
  column: Column;
  // columnId: ColumnId;
};

export default function ColumnDisplay({
  index,
  column,
}: ColumnDisplayProps) {
  return (
    <Draggable draggableId={column.columnId} index={index}>
      {(provided: DraggableProvided) => (
        <div
          className="min-h-[350px] rounded-xl bg-black p-3 text-black shadow-lg shadow-slate-900 hover:bg-slate-400 hover:text-slate-200"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h3 className=" px-4 py-2 text-center text-2xl font-bold text-white/90 sm:px-8 ">
            {column.role}
          </h3>
          <Droppable droppableId={column.columnId}>
            {(provided: DroppableProvided) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                columnId={column.columnId}
              >
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
