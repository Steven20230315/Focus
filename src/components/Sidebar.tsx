import { Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleSidebar } from '../features/list/listSlice';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import LinkList from '../features/list/LinkList';
import CreateList from '../features/list/CreateList';

export default function Sidebar() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.list.isSidebarOpen);

  return (
    <div className="relative flex">
      <div className="sticky top-0 z-20 flex h-full min-h-screen  w-[25px] flex-col bg-gray-600 p-1">
        <button onClick={() => dispatch(toggleSidebar(!isSidebarOpen))}>
          {isSidebarOpen ? <GoSidebarCollapse /> : <GoSidebarExpand />}
        </button>
      </div>
      <Transition
        show={isSidebarOpen}
        enter="transition-opacity ease-linear duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="absolute inset-y-0 left-[25px] z-10 flex w-[100px] flex-col bg-gray-600 shadow-lg "
      >
        <div className="p-2">
          <LinkList />
          <CreateList />
        </div>
      </Transition>
    </div>
  );
}
