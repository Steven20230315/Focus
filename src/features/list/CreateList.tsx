import { type FormEvent, useState, useRef, useEffect } from 'react';
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
  const [labelMessage, setLabelMessage] = useState('Enter list title');
  useEffect(() => {
    const listExists = listTitles.includes(title);
    setLabelMessage(listExists ? 'List already exists' : 'Enter list title');
  }, [listTitles, title]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimTitle = title.trim();
    if (!trimTitle) {
      console.log('Please enter a title');
      return;
    }
    if (listTitles.includes(trimTitle)) {
      setLabelMessage('List already exists');
      return;
    }
    dispatch(addListWithDefaultColumns(createNewListWithDefaultColumns(trimTitle)));
    setTitle(''); // Reset title state instead of using form reset
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
          {/* To position label  */}
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
              className="absolute left-0 top-0 px-2 py-1 text-slate-600 transition-all peer-placeholder-shown:text-gray-400 peer-focus:-top-7 peer-focus:text-gray-300 "
            >
              {labelMessage}
            </label>
          </div>
        </form>
      )}
    </div>
  );
}
