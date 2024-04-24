import { TaskId } from '../../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
// import { AiOutlineCheckCircle } from 'react-icons/ai';
import {
  Draggable,
  type DraggableProvided,
} from '@hello-pangea/dnd';
type TaskItemProps = {
  taskId: TaskId;
  index: number;
};

export default function TaskItem({
  taskId,
  index,
}: TaskItemProps) {
  const task = useSelector(
    (state: RootState) => state.task.allTasks[taskId],
  );
  return (
    <Draggable draggableId={taskId} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className=":hover:bg-black flex gap-5 bg-slate-100 p-2"
        >
          <p>
            {/* <AiOutlineCheckCircle/> */}
            <span className="m-2 font-semibold">
              {index + 1}.
            </span>
            {task.title}
          </p>
        </div>
      )}
    </Draggable>
  );
}
