import MainNav from "./components/MainNav";
import Sidebar from "./components/Sidebar";
import View from "./components/View";
import { DragDropContext } from "@hello-pangea/dnd";
import { useDragDrop } from "./hooks/useDragDrop";
function App() {
  const onDragEnd = useDragDrop();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen w-full bg-slate-200 ">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <MainNav />
        <div className="grid h-screen grid-cols-4 gap-5 ">
          <Sidebar />
          <View />
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
