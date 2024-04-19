import { type FormEvent } from 'react';
import { createID } from '../../utils/createID';
import { type Project } from '../../types';
import { useDispatch } from 'react-redux';
import { addProject } from './projectSlice';
import styled from 'styled-components';

const Container = styled.form`
	display: flex;
	flex-direction: column;
	padding: 0.5rem;
	gap: 0.5rem;
	border: 1px solid black;
`;

export default function AddNewProject() {
	const dispatch = useDispatch();
	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const title = new FormData(e.currentTarget).get('title') as string;
		const trimTitle = title.trim();
		if (!trimTitle) {
			console.log('Please enter a title');
			return;
		} else {
			const newProject: Project = {
				projectId: createID(),
				title: trimTitle,
			};
			dispatch(addProject(newProject));
		}
		e.currentTarget.reset();
	};

	return (
		<Container onSubmit={onSubmit} autoComplete='off'>
			<input type='text' name='title' />
			<button>Add new project</button>
		</Container>
	);
}
