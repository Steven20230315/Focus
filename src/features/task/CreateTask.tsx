import Datepicker from '../../components/Datepicker';
import PriorityPicker from '../../components/PriorityPicker';
import { isValid, parse } from 'date-fns';
import { FormEvent, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from './taskSlice';
import { ColumnId, ColumnRole, ListId, Priority, Task } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import useEscapeClose from '../../hooks/useEscapeClose';

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
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dueDate = new FormData(e.currentTarget).get('date') as string;
    const priority = new FormData(e.currentTarget).get('priority') as Priority;

    if (!title.trim()) return;

    // Create the base task object without dueDate
    const newTask: Task = {
      title,
      priority,
      listId,
      columnId,
      status: columnRole,
      taskId: uuidv4(),
      timeSpend: 0,
    };

    // If dueDate is provided and is valid, add it to the task object
    if (dueDate && isValid(parse(dueDate, 'yyyy-MM-dd', new Date()))) {
      newTask['dueDate'] = dueDate;
    }

    dispatch(addTask(newTask));
    e.currentTarget.reset();
    setIsFormOpen(false);
    setTitle('');
  };

  useEscapeClose(isFormOpen, setIsFormOpen);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isFormOpen && ref.current && !ref.current.contains(e.target as Node)) {
        setIsFormOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFormOpen]);

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={ref}>
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
          className="mx-auto flex h-7 w-full items-center justify-between gap-2 text-white"
          autoComplete="off"
        >
          <input
            type="text"
            placeholder="Enter Task Name"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="boder-white w-1/2 appearance-none bg-transparent text-black placeholder-black/50 focus:opacity-90 focus:outline-none  "
          />
          <div className="mr-7 flex items-center gap-3">
            <Datepicker />
            <PriorityPicker />
            <button
              className={`rounded-md bg-slate-500 px-2 py-1 text-xs hover:opacity-90 ${!title ? 'cursor-not-allowed' : 'cursor-pointer'} `}
              disabled={!title}
              type="submit"
            >
              Add
            </button>
            <button
              className="rounded-md bg-slate-500 px-2 py-1 text-xs hover:opacity-90"
              type="reset"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
