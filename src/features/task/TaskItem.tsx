import { TaskId } from '../../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import TaskTitle from './TaskTitle';
import { Draggable, type DraggableProvided } from '@hello-pangea/dnd';
import { AiOutlineSmallDash } from 'react-icons/ai';
import Datepicker from '../../components/Datepicker';

type TaskItemProps = {
  taskId: TaskId;
  index: number;
};

export default function TaskItem({ taskId, index }: TaskItemProps) {
  const task = useSelector((state: RootState) => state.task.allTasks[taskId]);
  return (
    <Draggable draggableId={taskId} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="grid h-full cursor-move grid-cols-12 gap-4 pb-3 pt-1 text-sm hover:bg-stone-700 "
        >
          {/* <AiOutlineCheckCircle/> */}
          <div className="col-span-5">
            <TaskTitle taskId={taskId} title={task.title} columnId={task.columnId} />
          </div>
          <div className="col-span-7 col-start-6 grid grid-cols-6 place-items-center gap-6 text-center">
            <div className="col-span-2">Time Spend</div>
            <div className="col-span-2">{task.dueDate ? task.dueDate : <Datepicker />}</div>
            <div className="col-span-1">{task.priority}</div>
            <div>
              <AiOutlineSmallDash className="m-auto" />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
