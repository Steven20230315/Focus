import Datepicker from '../../components/Datepicker';
import PriorityPicker from '../../components/PriorityPicker';
import { isValid, parse } from 'date-fns';
import { FormEvent, useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useHooks';
import { ColumnId, ColumnRole, ListId, Priority, Task } from '../../types';
import useEscapeClose from '../../hooks/useEscapeClose';
import useCloseOnLoseFocus from '../../hooks/useCloseOnLoseFocus';
import { createTask } from './taskSlice';

type CreateTaskProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  listId: ListId;
  columnId: ColumnId;
  columnRole: ColumnRole;
};

export default function CreateTask({ onMouseEnter, onMouseLeave, listId, columnId, columnRole }: CreateTaskProps) {
  const [title, setTitle] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const userId = useAppSelector((state) => state.user.userId);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dueDate = (new FormData(e.currentTarget).get('date') as string) || '0001-01-01';
    const priority = new FormData(e.currentTarget).get('priority') as Priority;
    if (!userId) return;
    if (!title.trim()) return;

    if (dueDate) {
      if (!isValid(parse(dueDate, 'yyyy-MM-dd', new Date()))) {
        return;
      }
    }
    if (dueDate && isValid(parse(dueDate, 'yyyy-MM-dd', new Date()))) {
      const newTask: Omit<Task, 'taskId'> = {
        title,
        priority,
        listId,
        columnId,
        status: columnRole,
        timeSpent: 0,
        dueDate,
        // In seconds
        pomodoroLength: 1500,
        userId,
      };
      dispatch(createTask(newTask));
    }
    // Create the base task object without dueDate

    e.currentTarget.reset();
    setIsFormOpen(false);
    setTitle('');
  };

  useEscapeClose(isFormOpen, setIsFormOpen);
  useCloseOnLoseFocus(ref, isFormOpen, setIsFormOpen);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={ref} className="relative flex">
      {!isFormOpen ? (
        <button
          role="open form for creating new task"
          type="button"
          className="inline-block h-5 w-20 cursor-pointer"
          onClick={() => setIsFormOpen(true)}
        >
          + Add task
        </button>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mx-auto flex h-7 w-full flex-1 items-center justify-between gap-2 text-white"
          autoComplete="off"
        >
          <input
            type="text"
            placeholder="Enter Task Name"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            ref={inputRef}
            className="w-1/2 appearance-none border-white bg-transparent text-black placeholder-black/50 focus:opacity-90 focus:outline-none  "
          />
          <div className=" flex min-w-0 flex-1 items-center gap-3 ">
            <div className="flex gap-2">
              <Datepicker />
              <PriorityPicker />
            </div>
            <div className="ml-auto mr-10 flex gap-2">
              <button
                className={`rounded-md bg-slate-400 px-2 py-1 text-xs hover:shadow-md hover:shadow-gray-600 hover:ring ${!title ? 'cursor-not-allowed' : 'cursor-pointer'} `}
                disabled={!title}
                type="submit"
              >
                Add
              </button>
              <button
                className="rounded-md bg-slate-400 px-2 py-1 text-xs hover:shadow-md hover:shadow-gray-600 hover:ring"
                type="reset"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
