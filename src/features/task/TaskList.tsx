import React from 'react';
import type { ColumnId, ColumnRole, Task } from '../../types';
import TaskItem from './TaskItem';
import { useSelector } from 'react-redux';
import { Droppable, type DroppableProvided } from '@hello-pangea/dnd';
import { selectTasksInColumn } from './TaskSelector';
import useSort from '../../hooks/useSort';
import { LuArrowBigUp } from 'react-icons/lu';
import { LuArrowBigDown } from 'react-icons/lu';
import { useAppSelector } from '../../hooks/useHooks';

type TaskListProps = React.HTMLAttributes<HTMLDivElement> & {
  columnId: ColumnId;
  columnRole: ColumnRole;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function TaskList({ columnId, onMouseEnter, onMouseLeave, columnRole }: TaskListProps) {
  const tasks = useSelector(selectTasksInColumn(columnId));
  const { setSortBy, sortedTasks, setSortingConfig, isDescending, sortBy } = useSort(tasks);
  return (
    <>
      <div className="divide-y-2" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div className=" grid h-fit grid-cols-12 gap-4 py-2 text-start text-xs font-bold sm:text-sm md:text-base lg:text-lg">
          <div className="col-span-5 flex" onClick={() => setSortBy('default')}>
            name
          </div>
          <div className="col-span-6 col-start-6 grid grid-cols-6 place-items-center gap-6 text-center">
            <div
              className={`col-span-2 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 transition-all hover:opacity-80 ${
                sortBy === 'timeSpend' ? 'border shadow ' : ''
              }`}
              onClick={() => setSortingConfig('timeSpend')}
            >
              Time Spend
              {sortBy === 'timeSpend' ? isDescending ? <LuArrowBigDown /> : <LuArrowBigUp /> : null}
            </div>
            <div
              className={`col-span-2 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 transition-all hover:opacity-80 ${sortBy === 'dueDate' ? 'border shadow ' : ''}`}
              onClick={() => setSortingConfig('dueDate')}
            >
              Due Date
              {sortBy === 'dueDate' ? isDescending ? <LuArrowBigDown /> : <LuArrowBigUp /> : null}
            </div>
            <div
              className={`col-span-2 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 transition-all hover:opacity-80 ${sortBy === 'priority' ? 'border shadow ' : ''}`}
              onClick={() => setSortingConfig('priority')}
            >
              Priority
              {sortBy === 'priority' ? isDescending ? <LuArrowBigDown /> : <LuArrowBigUp /> : null}
            </div>
            {/* <div>
              <FiPlusCircle />
            </div> */}
          </div>
        </div>
        <Droppable droppableId={`${columnRole}-${columnId}`} type="task">
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
