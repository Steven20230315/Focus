import styled from 'styled-components';
import { Droppable, type DroppableProvided } from '@hello-pangea/dnd';
import { useSelector } from 'react-redux';
import { type ColumnId } from '../types';
import type { RootState } from '../store';
import ColumnDisplay from '../features/column/ColumnDisplay';
import AddTask from '../features/task/AddTask';

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
	const currentList = useSelector((state: RootState) => state.list.currentList);
	const currentColumns = useSelector(
		(state: RootState) => state.column.columnsInCurrentList
	);
	const currentColumnsOrder = useSelector(
		(state: RootState) => state.column.columnIdsInCurrentList
	);

	return (
		<Container className='container'>
			view
			<h2>{currentList.title}</h2>
			<AddTask currentColumns={currentColumns} />
			<Droppable droppableId='view' direction='horizontal' type='column'>
				{(provided: DroppableProvided) => (
					<div
						className='display'
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{currentColumnsOrder.map((columnId: ColumnId, index: number) => (
							<ColumnDisplay
								key={columnId}
								column={currentColumns[columnId]}
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
