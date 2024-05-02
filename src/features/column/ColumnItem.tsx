import { Draggable, type DraggableProvided } from '@hello-pangea/dnd';
import { type ColumnId } from '../../types';
import TaskList from '../task/TaskList';
import { Disclosure, Transition } from '@headlessui/react';
import CreateTask2 from '../task/CreateTask';
type ColumnItemProps = {
  index: number;
  columnId: ColumnId;
};
import { BsCaretRightFill } from 'react-icons/bs';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function ColumnItem({ index, columnId }: ColumnItemProps) {
  const [isTaskListHovered, setIsTaskListHovered] = useState(false);
  const columnData = useSelector((state: RootState) => state.column.allColumns[columnId]);
  const handleMouseEnter = () => setIsTaskListHovered(true);
  const handleMouseLeave = () => setIsTaskListHovered(false);

  return (
    // <Draggable draggableId={column.columnId} index={index}>
    <Draggable draggableId={columnData.columnId} index={index}>
      {(provided: DraggableProvided) => (
        <div
          className={`rounded-xl bg-slate-500 p-3 text-gray-800/90 shadow-sm shadow-black ${isTaskListHovered ? '' : 'hover:bg-sky-600 hover:text-black'} `}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-center">
                  <BsCaretRightFill className={open ? 'rotate-90 transform' : ''} />
                  <h3 className="cursor-not-allowed text-center text-2xl  font-bold sm:px-8 sm:text-sm md:text-lg ">
                    {columnData.role}
                    {/* {column.role} */}
                  </h3>
                </Disclosure.Button>

                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="flex flex-col  text-sm">
                    <TaskList
                      columnId={columnData.columnId}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
                    <CreateTask2
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      listId={columnData.listId}
                      columnId={columnData.columnId}
                      columnRole={columnData.role}
                    />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </div>
      )}
    </Draggable>
  );
}
