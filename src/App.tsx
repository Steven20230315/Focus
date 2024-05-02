// import MainNav from "./components/MainNav";
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Sidebar from './components/Sidebar';
import View from './components/View';
import { DragDropContext } from '@hello-pangea/dnd';
import { useDragDrop } from './hooks/useDragDrop';
import Timer from './features/timer/Timer';

function App() {
  const onDragEnd = useDragDrop();
  const isSidebarOpen = useSelector((state: RootState) => state.list.isSidebarOpen);
  const isTimerActive = useSelector((state: RootState) => state.timer.isActive);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex">
        <div
          className={`${!isSidebarOpen && '-ml-[185px]'} sticky top-0 z-10 flex h-screen w-[250px] justify-between gap-6 bg-stone-200 font-mono transition-all duration-500`}
        >
          <Sidebar />
        </div>
        <div className="grow px-6 ">
          <View />
        </div>
      </div>
      {isTimerActive && <Timer />}
    </DragDropContext>
  );
}

export default App;
