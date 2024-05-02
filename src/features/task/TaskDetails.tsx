import { useAppDispatch, useAppSelector } from '../../hooks/useHooks';
import { Task } from '../../types';
import { manageTimer, pauseTimer } from '../timer/timerSlice';
import { selectTimerState } from '../timer/timerSelector';
import { BsPauseFill, BsCaretRightFill } from 'react-icons/bs';
// import { MdRestartAlt, MdOutlineNotStarted, MdPauseCircleOutline } from 'react-icons/md';
type TaskDetailsProps = {
  task: Task;
  // open?: boolean;
  // onClose?: () => void;
};
export default function TaskDetails({ task }: TaskDetailsProps) {
  const dispatch = useAppDispatch();
  const { isActive, ownerId, isRunning } = useAppSelector(selectTimerState);
  const handleStart = () => {
    dispatch(manageTimer(task));
  };

  const content = () => {
    const isTimerOwner = ownerId === task.taskId;
    const isTimerActive = isActive && isTimerOwner;
    const isTimerRunning = isTimerActive && isRunning;
    const timerIcon = isTimerRunning ? (
      <BsPauseFill className="h-3 w-3" onClick={() => dispatch(pauseTimer())} />
    ) : (
      <BsCaretRightFill className="h-3 w-3" onClick={handleStart} />
    );
    return <>{timerIcon}</>;
  };
  return (
    <div>
      <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border text-slate-50">
        {content()}
      </div>
      {/* <MdOutlineNotStarted />
      <MdRestartAlt />
      <MdPauseCircleOutline /> */}
    </div>
  );
}
