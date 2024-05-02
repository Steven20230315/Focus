import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { type Task } from '../../types';
import { RootState } from '../../store';
import { updateTask } from '../task/taskSlice';

// TODO: Need to test if moving the task will interrupt the timer.

// This function is called when the timer is started. It need to handle the case when the timer is already running
export const manageTimer = createAsyncThunk('timer/manageTimer', async (task: Task, { dispatch, getState }) => {
  const { timer } = getState() as RootState;

  // Function to start a timer
  const startNewTimer = (task: Task) => {
    dispatch(setTimerInfo(task));
    const intervalId = setInterval(() => {
      dispatch(tick());
      const { timer: updatedTimer } = getState() as RootState;
      if (updatedTimer.elapsedTime >= updatedTimer.duration) {
        clearInterval(intervalId);
        dispatch(updateTask({ ...task, timeSpend: task.timeSpend + updatedTimer.elapsedTime }));
        dispatch(resetTimer());
      }
    }, 1000);
    dispatch(setIntervalId(intervalId));
  };

  if (!timer.isActive) {
    // console.log('Starting new timer for task:', task.taskId);
    startNewTimer(task);
  } else if (timer.isActive && timer.owner && timer.owner.taskId !== task.taskId) {
    // console.log('Interrupting current timer to start new one for task:', task.taskId);
    if (timer.intervalId) clearInterval(timer.intervalId);
    if (timer.owner) {
      dispatch(updateTask({ ...timer.owner, timeSpend: timer.owner.timeSpend + timer.elapsedTime }));
    }
    dispatch(resetTimer());
    startNewTimer(task);
  } else {
    // console.log('Timer is already running for this task. Resetting and restarting.');
    // This block will restart the timer for the same task if it's already running but may need to be reset
    if (timer.intervalId) clearInterval(timer.intervalId);
    startNewTimer(task);
  }
});

// export const startTimer = createAsyncThunk('timer/startTimer', async (task: Task, { dispatch, getState }) => {});

export type TimerIsActive = {
  isActive: true;
  isRunning: boolean;
  owner: Task;
  elapsedTime: number;
  duration: number;
  remainingTime: number;
  intervalId: ReturnType<typeof setInterval> | null;
};

export type TimerIsNotActive = {
  isActive: false;
  isRunning: false;
  owner: null;
  elapsedTime: number;
  duration: number;
  remainingTime: number;
  intervalId: null;
};

type TimerState = {
  // State about the timer itself
  isActive: boolean;
  isRunning: boolean;
  // State about the owner
  owner: Task | null;
  // duration means how long the timer will last. Is from task.pomodoroLength
  duration: number;
  // How much time is already elapsed
  elapsedTime: number;
  // for tracking the setTimout
  // for tracking the setInterval
  intervalId: ReturnType<typeof setInterval> | null;
  remainingTime: number;
};

const initialState: TimerState = {
  isActive: false,
  isRunning: false,
  owner: null,
  elapsedTime: 0,
  duration: 0,
  intervalId: null,
  remainingTime: 0,
};
const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setTimerInfo: (state: TimerState, action: PayloadAction<Task>) => {
      state.isActive = true;
      state.isRunning = true;
      state.owner = action.payload;
      state.duration = action.payload.pomodoroLength;
      state.remainingTime = action.payload.pomodoroLength;
    },
    pauseTimer: (state: TimerState) => {
      if (state.isActive && state.isRunning && state.intervalId !== null) {
        clearInterval(state.intervalId);
        state.intervalId = null;
        // Transition state to TimerIsActiveNotRunning
        // TODO: TypeScript can't infer the type of state. Need to figure out how to fix it. I need to reconsider if the use of discreminated union is necessary
        state.isRunning = false;
      }
    },
    updateTimer: (state: TimerState, action) => {
      state.elapsedTime = action.payload;
    },
    // A total reset.
    resetTimer: (state: TimerState) => {
      state.isActive = false;
      state.elapsedTime = 0;
      state.isRunning = false;
      state.owner = null;
      // state.duration = 0;
      if (state.intervalId) clearInterval(state.intervalId);
      state.intervalId = null;
      // If there is an active timeout, clear it. Prevent multiple timeouts running at the same time
      state.remainingTime = 0;
    },
    tick(state: TimerState) {
      if (state.isActive) {
        state.elapsedTime += 1;
        state.remainingTime -= 1;
        if (state.remainingTime <= 0) {
          // Perform end of timer logic here
          if (state.intervalId !== null) {
            clearInterval(state.intervalId);
          }
          state.isActive = false;
          state.isRunning = false;
          // Dispatch task update logic here or reset timer
        }
      }
    },
    endTimer(state: TimerState) {
      state.isActive = false;
    },

    setIntervalId(state: TimerState, action) {
      state.intervalId = action.payload;
    },
  },
});

export const { setTimerInfo, pauseTimer, updateTimer, resetTimer, tick, endTimer, setIntervalId } = timerSlice.actions;
export default timerSlice.reducer;
