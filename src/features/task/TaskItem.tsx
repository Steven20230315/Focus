import { Task } from '../../types';
import { useDispatch } from 'react-redux';
import TaskTitle from './TaskTitle';
import { Draggable, type DraggableProvided } from '@hello-pangea/dnd';
// import { AiOutlineSmallDash } from 'react-icons/ai';
import Datepicker from '../../components/Datepicker';
import { updateTask, type UpdateTaskPayload } from './taskSlice';
import { format } from 'date-fns';

type TaskItemProps = {
  task: Task;
  index: number;
};

export default function TaskItem({ task, index }: TaskItemProps) {
  const dispatch = useDispatch();

  const updateDate = (day: Date) => {
    dispatch(
      updateTask({
        taskId: task.taskId,
        dueDate: format(day, 'yyyy-MM-dd'),
      } as UpdateTaskPayload),
    );
  };

  return (
    <Draggable draggableId={task.taskId} index={index}>
      {(provided: DraggableProvided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div className="my-1 grid h-full cursor-move grid-cols-12 content-center items-center gap-4 rounded-md py-2 text-sm hover:bg-slate-300 ">
            {/* <AiOutlineCheckCircle/> */}
            <div className="col-span-5">
              <TaskTitle taskId={task.taskId} title={task.title} columnId={task.columnId} />
            </div>
            <div className="col-span-6 col-start-6 grid grid-cols-6 place-items-center gap-6 text-center">
              <div className="col-span-2">{task.timeSpend}</div>
              <div className="col-span-2">
                {task.dueDate === '0001-01-01' ? (
                  <Datepicker onDateSelect={updateDate} />
                ) : (
                  <Datepicker onDateSelect={updateDate} date={task.dueDate} />
                )}
              </div>
              <div className="col-span-2">{task.priority}</div>
              {/* <div>
                <AiOutlineSmallDash className="m-auto" />
              </div> */}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
