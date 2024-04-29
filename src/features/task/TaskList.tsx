import React from 'react';
import type { ColumnId, Task } from '../../types';
import TaskItem from './TaskItem';
import { useSelector } from 'react-redux';
import { Droppable, type DroppableProvided } from '@hello-pangea/dnd';
import { selectTasksInColumn } from './TaskSelector';
import useSort from '../../hooks/useSort';
// import { FiPlusCircle } from 'react-icons/fi';

type TaskListProps = React.HTMLAttributes<HTMLDivElement> & {
  columnId: ColumnId;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function TaskList({ columnId, onMouseEnter, onMouseLeave }: TaskListProps) {
  const tasks = useSelector(selectTasksInColumn(columnId));
  const { setSortBy, sortedTasks, setSortingConfig } = useSort(tasks);

  return (
    <>
      <div className="divide-y-2" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div className=" grid h-fit grid-cols-12 gap-4  py-2 text-start text-lg font-bold sm:text-xs md:text-base">
          <div className="col-span-5" onClick={() => setSortBy('default')}>
            name
          </div>
          <div className="col-span-6 col-start-6 grid grid-cols-6 place-items-center gap-6 text-center">
            <div className="col-span-2 cursor-pointer hover:opacity-80" onClick={() => setSortingConfig('timeSpend')}>
              Time Spend
            </div>
            <div className="col-span-2 cursor-pointer hover:opacity-80" onClick={() => setSortingConfig('dueDate')}>
              Due Date
            </div>
            <div className="col-span-2 cursor-pointer hover:opacity-80" onClick={() => setSortingConfig('priority')}>
              Priority
            </div>
            {/* <div>
              <FiPlusCircle />
            </div> */}
          </div>
        </div>
        <Droppable droppableId={columnId} type="task">
          {(provided: DroppableProvided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="mb-3 flex flex-col justify-center divide-y"
            >
              {sortedTasks.map((task: Task, index: number) => (
                <TaskItem key={task.taskId} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );
}
