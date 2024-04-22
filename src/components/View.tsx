import styled from "styled-components";
import { Droppable, type DroppableProvided } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import { type Column } from "../types";
import ColumnDisplay from "../features/column/ColumnDisplay";
import AddTask from "../features/task/CreateTask";
import { getCurrentListAndColumns } from "../features/column/columnSelector";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  .display {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6rem;
    border: 1px solid black;
  }
`;

export default function View() {
  const { currentList, columnsInCurrentList } = useSelector(
    getCurrentListAndColumns,
  );

  return (
    <Container className="container col-span-3 bg-stone-100">
      view
      <h2>{currentList.title}</h2>
      <AddTask currentColumns={columnsInCurrentList} />
      <Droppable droppableId="view" direction="horizontal" type="column">
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
    </Container>
  );
}
