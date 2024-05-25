import { type FormEvent, useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useHooks';
import { selectAllListTitles } from './listSelector';
import useCloseOnLoseFocus from '../../hooks/useCloseOnLoseFocus';
import useEscapeClose from '../../hooks/useEscapeClose';
import useScreenSize from '../../hooks/useScreenSize';
import { createList } from './listSlice';
import Modal from '../../components/Modal';
export default function CreateList() {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const listTitles = useAppSelector(selectAllListTitles);
  const [title, setTitle] = useState('');
  const [labelMessage, setLabelMessage] = useState('Enter list title');
  const { width } = useScreenSize();
  const userId = useAppSelector((state) => state.user.userId);
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
    } else if (trimTitle.length < 3) {
      setLabelMessage('Title must be at least 3 characters');
      return;
    }
    if (listTitles.includes(trimTitle)) {
      setLabelMessage('List already exists');
      return;
    }
    if (userId) dispatch(createList({ title: trimTitle, userId: userId }));
    setTitle(''); // Reset title state instead of using form reset
    setIsOpen(false);
  };

  useCloseOnLoseFocus(ref, isOpen, setIsOpen);
  useEscapeClose(isOpen, setIsOpen);

  return (
    <div className="mt-4 cursor-pointer" ref={ref}>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} setIsOpen={() => setIsModalOpen(false)}>
          <p>Modal</p>
        </Modal>
      )}
      {!isOpen ? (
        <button type="button" onClick={() => setIsOpen(true)} className="ml-2 text-sm">
          {width && width < 640 ? '+' : '+ Create List'}
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
              autoFocus={isOpen}
              placeholder="Enter title (min 3 characters)"
              // minLength={3}
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
