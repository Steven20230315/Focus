import LinkList from '../features/list/LinkList';
import CreateList from '../features/list/CreateList';
import Checkbox from './Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../features/list/listSlice';
import { RootState } from '../store';
export default function Sidebar() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.list.isSidebarOpen);
  return (
    <div
      className={`sticky top-0 flex min-h-screen min-w-[250px] flex-col  px-2 pt-4  ${!isSidebarOpen ? 'bg-gray-700' : 'border border-gray-500 bg-gray-600 shadow-xl shadow-black'}`}
    >
      <div className="mb-4 flex justify-end">
        <Checkbox onClick={() => dispatch(toggleSidebar())} id="toggle sidebar" />
      </div>
      <LinkList />
      <CreateList />
    </div>
  );
}
