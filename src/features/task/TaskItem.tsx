import { TaskId } from '../../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Draggable } from '@hello-pangea/dnd';
type TaskItemProps = {
	taskId: TaskId;
	index: number;
};

export default function TaskItem({ taskId, index }: TaskItemProps) {
	const task = useSelector((state: RootState) => state.task.allTasks[taskId]);
	return (
		<Draggable draggableId={taskId} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={{
						...provided.draggableProps.style,
						opacity: snapshot.isDragging ? 0.5 : 1,
						backgroundColor: snapshot.isDragging ? '#f4f4f4' : 'white',
					}}
				>
					<h2>{task.title}</h2>
					<p>{task.taskId}</p>
					<p>{task.status}</p>
					<p>Below is task.columns id</p>
					<p>{ task.columnId}</p>
					<p>{index}</p>
				</div>
			)}
		</Draggable>
	);
}
