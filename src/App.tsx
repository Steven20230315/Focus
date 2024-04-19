import MainNav from './components/MainNav';
import Sidebar from './components/Sidebar';
import View from './components/View';
import styled from 'styled-components';
import { DragDropContext } from '@hello-pangea/dnd';
import { type DropResult } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { updateProjectOrder } from './features/projectDisplay/projectDisplaySlice';

const Container = styled.div`
	display: grid;
	grid-template-columns: 300px 1fr;
`;

function App() {
	const dispatch = useDispatch();
	const onDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		// Log only in development mode
		console.log(process.env.NODE_ENV);
		if (process.env.NODE_ENV === 'development') {
			if (!draggableId) console.log('draggableId is undefined');
			if (!destination) console.log('destination is undefined');
			if (!source) console.log('source is undefined');
			// if (!currentProject) console.log('currentProject is undefined');
		}
		// Check all conditions in one go
		if (!draggableId || !destination || !source) {
			console.log('Drag operation cancelled due to missing data.');
			return;
		}
		console.log(draggableId);
		if (destination && draggableId && source) {
			dispatch(
				updateProjectOrder({
					...result,
					projectId: draggableId,
				})
			);
		}
		console.log('Update successfully');
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<MainNav />
			<Container>
				<Sidebar />
				<View />
			</Container>
		</DragDropContext>
	);
}

export default App;
