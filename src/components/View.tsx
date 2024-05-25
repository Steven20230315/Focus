import { useAppSelector } from '../hooks/useHooks';
import ColumnList from '../features/column/ColumnList';
import { Transition } from '@headlessui/react';
import { getCurrentListTitle } from '../features/list/listSelector';
import { auth } from '../firebase/firebase-config';
import CreateColumns from '../features/column/CreateColumns';
export default function View() {
  // The view component only receives the list id and list title of the current list.
  // Changes to the columnIds or columnIdsOrder of the current list will not cause a re-render
  const handleSignOut = () => {
    auth.signOut();
  };
  const title = useAppSelector(getCurrentListTitle);
  const listId = useAppSelector((state) => state.list.currentListId);
  const allColumns = useAppSelector((state) => state.column.allColumns);
  const allLists = useAppSelector((state) => state.list.allLists);
  console.log(allColumns);
  console.log(allLists);
  return (
    <Transition
      show={true}
      id="sidebar"
      as="div"
      enter="transition ease-in duration-300"
      enterFrom="transform -translate-x-full opacity-0"
      enterTo="transform translate-x-0 opacity-100"
      leave="transition ease-in duration-400"
      leaveFrom="transform translate-x-0 opacity-100"
      leaveTo="transform -translate-x-full opacity-0"
      className="relative flex grow flex-col items-center lg:min-w-[1080px]  "
    >
      <h2 className="pb-3 text-center text-3xl font-bold"> {title ? title : 'Create a list to get started!'}</h2>
      <h3>List Id: {listId}</h3>
      <button onClick={handleSignOut}>Sign Out</button>
      <CreateColumns />
      {title && <ColumnList />}
    </Transition>
  );
}
