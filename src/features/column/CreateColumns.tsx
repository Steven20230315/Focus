import { FormEvent, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useHooks';
import { ColumnRole } from '../../types';
import { createColumn } from './columnSlice';
export default function CreateColumns() {
  const currentListId = useAppSelector((state) => state.list.currentListId);
  const userId = useAppSelector((state) => state.user.userId);
  const dispatch = useAppDispatch();
  // The default value for new column is "None". It's a status-less column
  const [role, setRole] = useState<ColumnRole>('None');
  const [title, setTitle] = useState<string>('');
  const roles: ColumnRole[] = ['To Do', 'In Progress', 'Done', 'Pending', 'None'];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || title.length < 3) return;
    if (!role || !roles.includes(role)) return;
    if (!userId) return;
    if (!currentListId) return;
    dispatch(createColumn({ title, role, userId, listId: currentListId }));
    setTitle('');
  };
  return (
    <div className="border">
      <form action="" onSubmit={onSubmit} method="POST" className="flex flex-col gap-4 p-4" autoComplete="off">
        <input
          type="text"
          placeholder="Enter column title"
          value={title}
          name="title"
          id="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <select title="role" value={role} name="role" id="role" onChange={(e) => setRole(e.target.value as ColumnRole)}>
          {roles.map((role: ColumnRole) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button type="submit" className="border hover:bg-slate-500">
          Add Column
        </button>
      </form>
    </div>
  );
}
