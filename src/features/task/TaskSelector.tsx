import { createSelector } from '@reduxjs/toolkit';
import { ColumnId, TaskId, Task, Column } from '../../types';
import { selectAllColumns } from '../column/columnSelector';
import { RootState } from '../../store';

const selectAllTasks = (state: RootState) => state.task.allTasks;

export const selectTasksInColumn = (columnId: ColumnId) =>
  createSelector(
    [selectAllTasks, selectAllColumns],
    (allTasks: Record<TaskId, Task>, allColumns: Record<ColumnId, Column>) => {
      console.log(allTasks);
      console.log(allColumns);
      console.log(columnId);
      const taskIds = allColumns[columnId]?.taskIds || [];
      return taskIds.map((taskId: TaskId) => allTasks[taskId]);
    },
  );
