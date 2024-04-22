import { Draggable, type DraggableProvided } from "@hello-pangea/dnd";
import { setCurrentList } from "../features/list/listSlice";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import { type List, type ListId } from "../types";
type LinkProps = {
  listId: ListId;
  index: number;
  listTitle: List["title"];
};

export default function Link({ listId, index, listTitle }: LinkProps) {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(setCurrentList(listId));
  };
  const currentListId = useSelector(
    (state: RootState) => state.list.currentListId,
  );

  return (
    <Draggable draggableId={listId} index={index}>
      {(provided: DraggableProvided) => (
        // <LinkContainer
        <div
          // $active={currentListId === list.listId}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          onClick={onClick}
          className="gap-2 rounded-sm bg-violet-200 text-violet-900"
        >
          {listTitle} - {currentListId === listId ? "Active" : "Inactive"}
        </div>
        // </LinkContainer>
      )}
    </Draggable>
  );
}
