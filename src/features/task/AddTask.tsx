import {
	type Task,
	type TaskId,
	type Column,
	type ColumnId,
} from '../../types';
import { type FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { addTask } from '../../features/task/taskSlice';
type AddNewTaskProps = {
	currentColumns: Record<ColumnId, Column>;
};

export default function AddTask({ currentColumns }: AddNewTaskProps) {
	const dispatch = useDispatch();
	const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const title = formData.get('title') as string;
		const columnId = formData.get('columnId') as ColumnId;
		const taskId = uuidv4() as TaskId;
		const newTask: Task = {
			taskId: taskId,
			title: title,
			listId: Object.values(currentColumns)[0].listId,
			columnId: columnId,
			status: currentColumns[columnId].role,
		};
		console.log('33');
		dispatch(addTask(newTask));
		console.log('35');
		e.currentTarget.reset();
		console.log('37');
		console.log(newTask);
	};
	return (
		<form onSubmit={handleAddTask} autoComplete='off'>
			<h3>Add new task component go here</h3>
			<input type='text' name='title' />
			<select name='columnId' id=''>
				{Object.values(currentColumns).map((column: Column) => (
					<option key={column.columnId} value={column.columnId}>
						{column.role}
					</option>
				))}
			</select>
			<button type='submit'>Add</button>
		</form>
	);
}
