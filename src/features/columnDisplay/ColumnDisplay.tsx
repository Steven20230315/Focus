import React from 'react';
import styled from 'styled-components';
import { Draggable, type DraggableProvided } from '@hello-pangea/dnd';
const Container = styled.ul`
	display: flex;
	flex-direction: column;
	border: 1px solid black;
	gap: 0.5rem;
	padding: 0.5rem;
	margin: 0.5rem;
	text-align: center;
`;

type ColumnDisplayProps = {
	title: string;
	children?: React.ReactNode;
	index: number;
};

export default function ColumnDisplay({
	title,
	children,
	index,
}: ColumnDisplayProps) {
	return (
		<Draggable draggableId={title} index={index}>
			{(provided: DraggableProvided) => (
				<Container
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<h3>{title}</h3>
					<div>Task 1</div>
					<div>Task 2</div>
					<div>Task 3</div>
					{children}
				</Container>
			)}
		</Draggable>
	);
}
