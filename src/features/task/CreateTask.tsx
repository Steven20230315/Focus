import { type Task, type TaskId, type Column, type ColumnId } from '../../types';
import { type FormEvent, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { addTask } from './taskSlice';
import { selectColumnsInOriginalOrder } from '../column/columnSelector';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function CreateTask() {
  const dispatch = useDispatch();
  const currentColumns = useSelector(selectColumnsInOriginalOrder);
  const [title, setTitle] = useState('');
  const currentListId = useSelector((state: RootState) => state.list.currentListId);

  useEffect(() => {
    setTitle('');
  }, [currentListId]);

  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const trimTitle = title.trim();
    if (!trimTitle) {
      console.log('Empty title');
      return;
    }
    const columnId = formData.get('columnId') as ColumnId;
    const taskId = uuidv4() as TaskId;
    const selectedColumn = currentColumns.find((column: Column) => column.columnId === columnId);
    if (!selectedColumn) {
      throw new Error('Column not found');
    }
    const newTask: Task = {
      taskId: taskId,
      title: title,
      listId: currentListId,
      columnId: selectedColumn.columnId,
      status: selectedColumn.role,
    };
    dispatch(addTask(newTask));
    e.currentTarget.reset();
  };
  return (
    <div>
      {/* <DropdownMenu /> */}
      <form key={currentListId} onSubmit={handleAddTask} autoComplete="off" className="flex gap-5">
        <input
          className="rounded-xl px-3 py-2"
          type="text"
          name="title"
          placeholder="Enter task title"
          defaultValue={title}
        />
        <select name="columnId" id="columnId" className="flex gap-3 rounded-xl px-3 py-2">
          {currentColumns.map((column: Column) => (
            <option key={column.columnId} value={column.columnId}>
              {column.role}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}
