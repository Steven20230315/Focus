import { useSelector } from "react-redux";
import { type List } from "../../types";
import Link from "../../components/Link";
import { Droppable, type DroppableProvided } from "@hello-pangea/dnd";
import { getAllListTitlesAndIdsInOrder } from "../../features/list/listSelector";

// The expected behavior of the project list
// 1. Renders the list of projects when the component is mounted
// 2. Renders when the project list changes
// 3. Renders when the project list order changes

export default function ProjectList() {
  const listTitlesAndIdsInOrder = useSelector(getAllListTitlesAndIdsInOrder);
  console.log("listTitlesAndIdsInOrder", listTitlesAndIdsInOrder);
  return (
    <Droppable droppableId="sidebar">
      {(provided: DroppableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="some-class-for-styling"
        >
          {listTitlesAndIdsInOrder.map( ( list: {listId: List["listId"], listTitle: List["title"]}, index: number) => (
            // Assuming Link component takes listId and listTitle as props
            <Link
              key={list.listId}
              listId={list.listId!}
              index={index}
              listTitle={list.listTitle!}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
