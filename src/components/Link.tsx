import React from 'react';
import { Draggable, type DraggableProvided } from '@hello-pangea/dnd';
type LinkProps = {
	title: string;
	projectId: string;
	index: number;
};

export default function Link({ title, projectId, index }: LinkProps) {
	return (
		<Draggable draggableId={projectId} index={index}>
			{(provided: DraggableProvided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<h3>{title}</h3>
					<p>{projectId}</p>
				</div>
			)}
		</Draggable>
	);
}
