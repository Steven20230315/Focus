import Sidebar from '../components/Sidebar.js';
import View from '../components/View.js';
import { DragDropContext } from '@hello-pangea/dnd';
import { useDragDrop } from '../hooks/useDragDrop.js';
import Modal from '../components/Modal.js';
import { useState } from 'react';
// import Timer from '../features/timer/Timer.js';
function App() {
  const onDragEnd = useDragDrop();
  const [open, isOpen] = useState(false);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex">
        {/* <Modal isOpen={open} setIsOpen={() => isOpen(false)}>
          <p>Modal</p>
        </Modal> */}
        <Sidebar />
        <View />
      </div>
      {/* {isTimerActive && <Timer />} */}
    </DragDropContext>
  );
}

export default App;
