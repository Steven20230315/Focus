import { BsCaretRightFill, BsPauseFill } from 'react-icons/bs';
import { pauseTimer, manageTimer, endTimer } from './timerSlice';
import { RootState } from '../../store';
import { ImStop } from 'react-icons/im';
import { useAppDispatch, useAppSelector } from '../../hooks/useHooks';

export default function Timer() {
  const dispatch = useAppDispatch();
  const { isActive, elapsedTime, duration, isRunning, owner } = useAppSelector((state: RootState) => state.timer);

  const handleStartTimer = () => {
    if (owner) {
      dispatch(manageTimer(owner));
    } else {
      // Handle error or invalid state if needed
      console.error('No task available to start or stop the timer.');
    }
  };

  return (
    <>
      <div className="absolute bottom-5 right-1/2 z-50 flex w-fit translate-x-1/2 items-center justify-center gap-12 rounded-lg bg-black px-4 py-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-50/50 text-white transition-all">
          {Math.floor((duration - elapsedTime) / 60)}:
          {(duration - elapsedTime) % 60 < 10 ? `0${(duration - elapsedTime) % 60}` : (duration - elapsedTime) % 60}
        </div>
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-slate-50">
          {isActive && isRunning && <BsPauseFill className="h-3 w-3" onClick={() => dispatch(pauseTimer())} />}
          {isActive && !isRunning && <BsCaretRightFill className="h-3 w-3" onClick={handleStartTimer} />}
        </div>
        {isActive && (
          <button type="button" title="Stop timer" onClick={() => dispatch(endTimer())} className="text-white">
            <ImStop />
          </button>
        )}
      </div>
    </>
  );
}
