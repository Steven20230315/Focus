import { Draggable, type DraggableProvided, Droppable, type DroppableProvided } from '@hello-pangea/dnd';
import { type Column } from '../../types';
import TaskList from '../task/TaskList';
import { Disclosure, Transition } from '@headlessui/react';
type ColumnItemProps = {
  index: number;
  column: Column;
  // columnId: ColumnId;
};
import { BsCaretRightFill } from 'react-icons/bs';

export default function ColumnItem({ index, column }: ColumnItemProps) {
  return (
    <Draggable draggableId={column.columnId} index={index}>
      {(provided: DraggableProvided) => (
        <div
          className="rounded-xl bg-stone-400/90 p-3 text-gray-800/90 shadow-sm shadow-black hover:bg-stone-500/90 hover:text-black "
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-center">
                  <BsCaretRightFill className={open ? 'rotate-90 transform' : ''} />
                  <h3 className=" px-4 py-2 text-center text-2xl font-bold  sm:px-8 ">{column.role}</h3>
                </Disclosure.Button>

                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                    <TaskList columnId={column.columnId} />
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
