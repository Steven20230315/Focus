import styled from 'styled-components';
import {
	Draggable,
	type DraggableProvided,
	Droppable,
	type DroppableProvided,
} from '@hello-pangea/dnd';
import { type TaskId, type Column } from '../../types';
import TaskList from '../task/TaskList';
const Container = styled.ul`
	display: flex;
	flex-direction: column;
	border: 1px solid black;
	gap: 0.5rem;
	padding: 0.5rem;
	margin: 0.5rem;
	text-align: center;
	min-height: 200px;
`;

type ColumnDisplayProps = {
	index: number;
	column: Column;
};

export default function ColumnDisplay({ index, column }: ColumnDisplayProps) {
	return (
		<Draggable draggableId={column.columnId} index={index}>
			{(provided: DraggableProvided) => (
				<Container
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<h3>{column.role}</h3>
					<p>{column.columnId}</p>
					<Droppable droppableId={column.columnId}>
						{(provided: DroppableProvided) => (
							<TaskList
								ref={provided.innerRef}
								{...provided.droppableProps}
								columnId={column.columnId}
							>
								{provided.placeholder}
							</TaskList>
						)}
					</Droppable>
				</Container>
			)}
		</Draggable>
	);
}
