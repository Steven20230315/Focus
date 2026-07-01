import { useState, useRef } from 'react';
import { createNewListWithDefaultColumns } from '../../utils/createNewList';
import { useDispatch, useSelector } from 'react-redux';
import { addListWithDefaultColumns } from './listSlice';
import { selectAllListTitles } from './listSelector';
import useCloseOnLoseFocus from '../../hooks/useCloseOnLoseFocus';
import useEscapeClose from '../../hooks/useEscapeClose';

export default function CreateList() {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const listTitles = useSelector(selectAllListTitles);
  const [title, setTitle] = useState('');

  const trimmedTitle = title.trim();
  const listExists = trimmedTitle !== '' && listTitles.includes(trimmedTitle);
  const labelMessage = listExists ? 'List already exists' : 'Enter list title';

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trimmedTitle) {
      console.log('Please enter a title');
      return;
    }

    if (listExists) {
      return;
    }

    dispatch(addListWithDefaultColumns(createNewListWithDefaultColumns(trimmedTitle)));
    setTitle('');
    setIsOpen(false);
  };

  useCloseOnLoseFocus(ref, isOpen, setIsOpen);
  useEscapeClose(isOpen, setIsOpen);

  return (
    <div className="mt-4 cursor-pointer" ref={ref}>
      {!isOpen ? (
        <button type="button" onClick={() => setIsOpen(true)} className="ml-2">
          + Create List
        </button>
      ) : (
        <form onSubmit={onSubmit} autoComplete="off" className="mt-4">
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="peer rounded-md px-2 py-1 text-slate-600 focus:outline-none"
            />
            <label
              htmlFor="title"
              className="absolute top-0 left-0 px-2 py-1 text-slate-600 transition-all peer-placeholder-shown:text-gray-400 peer-focus:-top-7 peer-focus:text-gray-300"
            >
              {labelMessage}
            </label>
          </div>
        </form>
      )}
    </div>
  );
}
