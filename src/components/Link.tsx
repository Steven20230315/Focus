import { Draggable, type DraggableProvided } from '@hello-pangea/dnd';
import { setCurrentList } from '../features/list/listSlice';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { type List, type ListId } from '../types';
import { Menu } from '@headlessui/react';
import { BsThreeDots } from 'react-icons/bs';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiEdit3 } from 'react-icons/fi';
import { deleteList, updateListTitle } from '../features/list/listSlice';
import { type MouseEvent, useState, useRef } from 'react';

type LinkProps = {
  listId: ListId;
  index: number;
  listTitle: List['title'];
};
export default function Link({ listId, index, listTitle }: LinkProps) {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(setCurrentList(listId));
  };
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  const currentListId = useSelector((state: RootState) => state.list.currentListId);
  const listData = useSelector((state: RootState) => state.list.allLists[listId]);
  const isSidebarOpen = useSelector((state: RootState) => state.list.isSidebarOpen);

  function editListHandler(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsEditing(true);
    inputRef.current?.focus();
  }

  function deleteListHandler(e: MouseEvent<HTMLButtonElement>) {
    // Otherwise, when users click on the delete button, it will set this list as the current list
    e.stopPropagation();

    dispatch(deleteList(listData));
  }

  return (
    <Draggable draggableId={listId} index={index}>
      {(provided: DraggableProvided) => (
        // <LinkContainer
        <a
          // $active={currentListId === list.listId}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          onClick={onClick}
          className={` flex rounded-xl bg-gray-400  px-4  py-2 font-bold text-slate-700  hover:bg-slate-400 hover:text-slate-50 ${currentListId === listId ? 'shadow shadow-inherit ring-1 ring-slate-300' : 'shadow-inherit/70 shadow-sm shadow-inherit'} ${!isSidebarOpen && 'opacity-0'}`}
        >
          {!isEditing ? (
            <h2>{listTitle}</h2>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const title = new FormData(e.currentTarget).get('title') as string;
                if (title) {
                  if (title.trim() !== listTitle) {
                    dispatch(updateListTitle({ listId, title }));
                  }
                  setIsEditing(false);
                }
              }}
            >
              <input
                type="text"
                defaultValue={listTitle}
                name="title"
                placeholder={listTitle}
                className="bg-transparent focus:text-white focus:outline-none"
                ref={inputRef}
              />
            </form>
          )}
          <Menu as="div" className=" relative ml-auto inline-block text-left ">
            {/* Prevent setting current list when clicking dropdown */}
            <Menu.Button onClick={(e) => e.stopPropagation()}>
              <BsThreeDots className=" h-3 w-3 translate-y-[60%]" />
            </Menu.Button>
            <Menu.Items className="absolute -left-1 top-4 z-10 mt-3 flex w-24 flex-col gap-1 divide-y divide-gray-100 rounded-md border bg-gray-500 text-xs font-thin shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-3 py-3">
                <Menu.Item>
                  <button
                    type="button"
                    title="Edit list name"
                    className="flex w-full items-center gap-3 text-white"
                    onClick={editListHandler}
                  >
                    <FiEdit3 /> Edit
                  </button>
                </Menu.Item>
              </div>
              <div className="flex px-3 py-3">
                <Menu.Item>
                  <button
                    type="button"
                    title="Delete list"
                    className="flex w-full items-center gap-3 text-white"
                    onClick={deleteListHandler}
                  >
                    <RiDeleteBinLine /> Delete
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </a>
        // </LinkContainer>
      )}
    </Draggable>
  );
}
