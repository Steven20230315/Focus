import LinkContainer from '../styles/LinkContainer';
import { Draggable, type DraggableProvided } from '@hello-pangea/dnd';
import { setCurrentList } from '../features/list/listSlice';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { type List } from '../types';
type LinkProps = {
	list: List;
	index: number;
};

export default function Link({ list, index }: LinkProps) {
	const dispatch = useDispatch();
	const onClick = () => {
		dispatch(setCurrentList(list));
	};
	const currentListId = useSelector(
		(state: RootState) => state.list.currentList.listId
	);

	return (
		<Draggable draggableId={list.listId} index={index}>
			{(provided: DraggableProvided) => (
				<LinkContainer
					$active={currentListId === list.listId}
					ref={provided.innerRef}
					{...provided.dragHandleProps}
					{...provided.draggableProps}
					onClick={onClick}
				>
					{list.title} - {currentListId === list.listId ? 'Active' : 'Inactive'}
				</LinkContainer>
			)}
		</Draggable>
	);
}
