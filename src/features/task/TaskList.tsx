import React from 'react';
import type { ColumnId, TaskId } from '../../types';
import TaskItem from './TaskItem';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Droppable, type DroppableProvided } from '@hello-pangea/dnd';
import { FiPlusCircle } from 'react-icons/fi';

type TaskListProps = React.HTMLAttributes<HTMLDivElement> & {
  columnId: ColumnId;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function TaskList({ columnId, onMouseEnter, onMouseLeave }: TaskListProps) {
  const tasksInColumn = useSelector((state: RootState) => state.column.allColumns[columnId].taskIds);

  return (
    <>
      <div className="divide-y-2" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div className=" grid grid-cols-12 gap-4 py-2 text-start text-lg font-bold">
          <div className="col-span-5">name</div>
          <div className="col-span-7 col-start-6 grid grid-cols-6 place-items-center gap-6 text-center">
            <div className="col-span-2">Time Spend</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-1">Priority</div>
            <div>
              <FiPlusCircle />
            </div>
          </div>
        </div>
        <Droppable droppableId={columnId} type="task">
          {(provided: DroppableProvided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="mb-3 flex flex-col justify-center divide-y"
            >
              {tasksInColumn.map((taskId: TaskId, index: number) => (
                <TaskItem key={taskId} taskId={taskId} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );
}
