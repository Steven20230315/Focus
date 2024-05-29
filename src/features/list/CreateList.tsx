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
  const [labelMessage, setLabelMessage] = useState('Enter title');
  const { width } = useScreenSize();
  const userId = useAppSelector((state) => state.user.userId);
  useEffect(() => {
    const listExists = listTitles.includes(title);
    setLabelMessage(listExists ? 'List already exists' : 'Enter title');
  }, [listTitles, title]);

  useEffect(() => {
    if (!isOpen) setTitle('');
  }, [isOpen]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimTitle = title.trim();
    if (!trimTitle) {
      setLabelMessage('Please enter a title');
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
    setIsModalOpen(false);
  };

  useCloseOnLoseFocus(ref, isOpen, setIsOpen);
  useEscapeClose(isOpen, setIsOpen);

  const handleOpenForm = () => {
    if (width && width < 640) {
      setIsModalOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="mt-4 cursor-pointer" ref={ref}>
      {isModalOpen && (
        <Modal setIsOpen={() => setIsModalOpen(false)}>
          <form action="" onSubmit={onSubmit} autoComplete="off" className="mt-4 flex flex-col gap-3">
            <label htmlFor="title">{labelMessage}</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus={isModalOpen}
              className="rounded-md border border-slate-300 px-2 py-1 text-slate-600 focus:outline-none"
            />
          </form>
        </Modal>
      )}

      {!isOpen ? (
        <button type="button" onClick={handleOpenForm} className="ml-2 text-sm">
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
              className="peer w-[90%] rounded-md px-2 py-1 text-slate-600 focus:outline-none"
              autoFocus={isOpen}
              placeholder="Enter title"
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
