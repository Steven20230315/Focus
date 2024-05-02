import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../../store';

const selectTimer = (state: RootState) => state.timer;

export const selectTimerState = createSelector(selectTimer, (timer) => {
  const isActive = timer.isActive;
  const ownerId = timer.owner?.taskId;
  const isRunning = timer.isRunning;

  return { isActive: isActive, ownerId: ownerId, isRunning: isRunning };
});
