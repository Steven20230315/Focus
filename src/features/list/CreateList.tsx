import { type FormEvent } from 'react';
import { createNewListWithDefaultColumns } from '../../utils/createNewList';
import { useDispatch } from 'react-redux';
import { addListWithDefaultColumns } from './listSlice';
import styled from 'styled-components';

const Container = styled.form`
	display: flex;
	flex-direction: column;
	padding: 0.5rem;
	gap: 0.5rem;
	border: 1px solid black;
`;

export default function AddList() {
	const dispatch = useDispatch();
	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const title = new FormData(e.currentTarget).get('title') as string;
		const trimTitle = title.trim();
		if (!trimTitle) {
			console.log('Please enter a title');
			return;
		} else {
			// create a new list with default columns
			const newList = createNewListWithDefaultColumns(trimTitle);
			// Pass the new list to
			dispatch(addListWithDefaultColumns(newList));
		}
		e.currentTarget.reset();
	};

	return (
		<Container onSubmit={onSubmit} autoComplete='off'>
			<input type='text' name='title' />
			<button>Add new list</button>
		</Container>
	);
}
