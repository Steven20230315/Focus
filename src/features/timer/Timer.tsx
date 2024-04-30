import { useState, useEffect } from 'react';
import { BsCaretRightFill, BsPauseFill } from 'react-icons/bs';

export default function Timer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(25 * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="absolute bottom-5 right-1/2 z-50 flex w-fit translate-x-1/2 items-center justify-center gap-12 rounded-lg bg-black px-4 py-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-50/50 text-white transition-all">
        {formatTime(seconds)}
      </div>
      <div
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-slate-50"
        onClick={toggle}
      >
        {isActive ? <BsPauseFill /> : <BsCaretRightFill />}
      </div>
      {isActive && (
        <button onClick={reset} className="text-white">
          Reset
        </button>
      )}
    </div>
  );
}
