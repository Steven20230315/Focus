import { useSelector } from 'react-redux';
import { type List } from '../../types';
import Link from '../../components/Link';
import { Droppable, type DroppableProvided } from '@hello-pangea/dnd';
import { RootState } from '../../store';

// The expected behavior of the project list
// 1. Renders the list of projects when the component is mounted
// 2. Renders when the project list changes
// 3. Renders when the project list order changes

export default function ProjectList() {
	const lists = useSelector((state: RootState) => state.list.allLists);
	const listsOrder = useSelector((state: RootState) => state.list.listsOrder);
	return (
		<Droppable droppableId='sidebar'>
			{(provided: DroppableProvided) => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					{listsOrder.map((id: List['listId'], index: number) => (
						<Link key={id} list={lists[id]} index={index} />
					))}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
}
