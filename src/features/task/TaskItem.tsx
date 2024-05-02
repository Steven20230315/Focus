import { Task, type Priority } from '../../types';
import TaskDetails from './TaskDetails';
import { useAppDispatch } from '../../hooks/useHooks';
import TaskTitle from './TaskTitle';
import { Draggable, type DraggableProvided } from '@hello-pangea/dnd';
// import { AiOutlineSmallDash } from 'react-icons/ai';
import Datepicker from '../../components/Datepicker';
import { updateTask, type UpdateTaskPayload } from './taskSlice';
import { format } from 'date-fns';
import PriorityPicker from '../../components/PriorityPicker';
import { memo, useState } from 'react';
import { CiClock2 } from 'react-icons/ci';

type TaskItemProps = {
  task: Task;
  index: number;
};

const TaskItem = memo(function TaskItem({ task, index }: TaskItemProps) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const updatePriority = (priority: Priority) => {
    dispatch(
      updateTask({
        taskId: task.taskId,
        priority: priority,
      } as UpdateTaskPayload),
    );
  };

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
          <div className="my-1 grid h-full cursor-move grid-cols-12 content-center items-center gap-4 rounded-md py-2 text-sm   ">
            <div className="col-span-5 flex gap-6">
              <TaskTitle taskId={task.taskId} title={task.title} columnId={task.columnId} />
              <button type="button" onClick={() => setOpen(!open)} title="Details">
                {!open && <CiClock2 />}
              </button>
              {open && (
                <TaskDetails task={task}>
                  {/* <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border text-slate-50">
                  {ownerId === task.taskId && isActive ? (
                    <BsPauseFill onClick={() => dispatch(pauseTimer(task))} />
                  ) : (
                    <BsCaretRightFill onClick={handleStart} />
                  )}
                </div> */}
                </TaskDetails>
              )}
            </div>
            <div className="col-span-6 col-start-6 grid grid-cols-6 place-items-center gap-6 text-center">
              <div className="col-span-2">
                {Math.floor(task.timeSpend / 60)}:
                {task.timeSpend % 60 < 10 ? `0${task.timeSpend % 60}` : task.timeSpend % 60}
              </div>
              <div className="col-span-2  flex  w-full items-center justify-center rounded-md px-2 py-1 hover:ring  ">
                <Datepicker onDateSelect={updateDate} date={task.dueDate} />
                {/* <div>{task.dueDate}</div> */}
              </div>
              <div className="col-span-2  flex h-full w-full items-center justify-center rounded-md px-2 py-1 hover:ring  ">
                <PriorityPicker onPrioritySelect={updatePriority} priority={task.priority} />
              </div>
              {/* <div>
                <AiOutlineSmallDash className="m-auto" />
              </div> */}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

export default TaskItem;
// 130.5 x 28
// 130.5 x 29.7
