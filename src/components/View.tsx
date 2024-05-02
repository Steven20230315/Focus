import { useSelector } from 'react-redux';
import ColumnList from '../features/column/ColumnList';
import { Transition } from '@headlessui/react';
import { selectCurrentListDetails } from '../features/list/listSelector';

export default function View() {
  // The view component only receives the list id and list title of the current list.
  // Changes to the columnIds or columnIdsOrder of the current list will not cause a re-render

  const title = useSelector(selectCurrentListDetails);
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
      className="item-center relative flex  grow flex-col gap-6  p-6"
    >
      <h2 className="text-center text-7xl font-bold"> {title ? title : 'Create a list to get started!'}</h2>
      {title && <ColumnList />}
    </Transition>
  );
}
