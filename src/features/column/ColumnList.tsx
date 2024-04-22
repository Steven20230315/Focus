import { Droppable, type DroppableProvided } from "@hello-pangea/dnd";
import type { Column } from "../../types";
import ColumnDisplay from "./ColumnDisplay";
import { selectColumnsInUpdatedOrder } from "./columnSelector";

import { useSelector } from "react-redux";

export default function ColumnList() {
  const columnsInCurrentList = useSelector(selectColumnsInUpdatedOrder);
  return (
    <Droppable
      droppableId={columnsInCurrentList[0].listId}
      direction="horizontal"
      type="column"
    >
      {(provided: DroppableProvided) => (
        <div
          className="display"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {columnsInCurrentList.map((column: Column, index: number) => (
            <ColumnDisplay
              key={column.columnId}
              column={column}
              index={index}
            />
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
