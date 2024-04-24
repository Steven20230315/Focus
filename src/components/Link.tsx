import {
  Draggable,
  type DraggableProvided,
} from '@hello-pangea/dnd';
import { setCurrentList } from '../features/list/listSlice';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { type List, type ListId } from '../types';
type LinkProps = {
  listId: ListId;
  index: number;
  listTitle: List['title'];
};
export default function Link({
  listId,
  index,
  listTitle,
}: LinkProps) {
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
        <a
          // $active={currentListId === list.listId}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          onClick={onClick}
          className="rounded-xl bg-slate-200 p-3 text-xs font-bold text-slate-900 visited:text-purple-600 hover:bg-slate-400 hover:text-slate-200 "
        >
          {listTitle}
        </a>
        // </LinkContainer>
      )}
    </Draggable>
  );
}
