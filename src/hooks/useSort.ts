import { useState, useMemo } from 'react';
import { Priority, Task } from '../types/taskTypes';
import { parse, isAfter, isBefore } from 'date-fns';

export type SortingOptions = 'default' | 'timeSpend' | 'dueDate' | 'priority';

const Priorities: Priority[] = ['Low', 'Normal', 'High', 'Urgent'];

export default function useSort(tasks: Task[]) {
  const [sortBy, setSortBy] = useState<SortingOptions>('default');
  const [isDescending, setIsDescending] = useState(true);

  const setSortingConfig = (sortOption: SortingOptions) => {
    if (sortBy !== sortOption) {
      setSortBy(sortOption);
    } else {
      setIsDescending(!isDescending);
    }
  };

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks];
    sorted.sort((a, b) => {
      const aDate = parse(a.dueDate, 'yyyy-MM-dd', new Date());
      const bDate = parse(b.dueDate, 'yyyy-MM-dd', new Date());
      if (sortBy === 'timeSpend') {
        if (isDescending) {
          return b.timeSpend - a.timeSpend;
        } else {
          return a.timeSpend - b.timeSpend;
        }
      } else if (sortBy === 'dueDate') {
        if (isDescending) {
          return isBefore(aDate, bDate) ? 1 : -1;
        } else {
          return isAfter(aDate, bDate) ? 1 : -1;
        }
      } else if (sortBy === 'priority') {
        if (isDescending) {
          return Priorities.indexOf(b.priority) - Priorities.indexOf(a.priority);
        } else {
          return Priorities.indexOf(a.priority) - Priorities.indexOf(b.priority);
        }
      } else {
        return 0;
      }
    });

    return sorted;
  }, [tasks, sortBy, isDescending]);

  return {
    setSortBy,
    sortedTasks,
    setSortingConfig,
  };
}
