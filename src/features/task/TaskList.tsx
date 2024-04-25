import React from 'react';
import type { ColumnId, TaskId } from '../../types';
import TaskItem from './TaskItem';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Droppable, type DroppableProvided } from '@hello-pangea/dnd';

type TaskListProps = React.HTMLAttributes<HTMLDivElement> & {
  columnId: ColumnId;
  children?: React.ReactNode;
};

export default function TaskList({ columnId }: TaskListProps) {
  const tasksInColumn = useSelector((state: RootState) => state.column.allColumns[columnId].taskIds);

  return (
    <Droppable droppableId={columnId} type="task">
      {(provided: DroppableProvided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-3">
          {tasksInColumn.map((taskId: TaskId, index: number) => (
            <TaskItem key={taskId} taskId={taskId} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
