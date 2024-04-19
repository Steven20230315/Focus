import styled from 'styled-components';
import ColumnDisplay from '../features/columnDisplay/ColumnDisplay';
import { Droppable, type DroppableProvided } from '@hello-pangea/dnd';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

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
	const order = useSelector(
		(state: RootState) => state.columnDisplay.columnDisplayOrder
	);
	return (
		<Container className='container'>
			view
			<h2>Project Title Go here</h2>
			<form action=''>
				<h3>Add new task component go here</h3>
				<input type='text' />
			</form>
			<Droppable droppableId='view'>
				{(provided: DroppableProvided) => (
					<div
						className='display'
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{order.map((role: string, index: number) => (
							<ColumnDisplay key={role} title={role} index={index} />
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</Container>
	);
}
