import { createSlice } from '@reduxjs/toolkit';
import { type ColumnRole } from '../../types';
import { type PayloadAction } from '@reduxjs/toolkit';
import { type DropResult } from '@hello-pangea/dnd';

interface ColumnDisplayState {
	columnDisplayOrder: ColumnRole[];
}

const initialState: ColumnDisplayState = {
	columnDisplayOrder: ['To Do', 'In Progress', 'Done', 'Pending'],
};

const columnDisplaySlice = createSlice({
	name: 'columnDisplay',
	initialState,
	reducers: {
		updateColumnOrder: (
			state: ColumnDisplayState,
			action: PayloadAction<DropResult>
		) => {
			const { source, destination, draggableId } = action.payload;
			console.log(source, destination);
			if (!destination) {
				console.log('Destination is undefined');
				return;
			}
			const oldIndex = source.index;
			const newIndex = destination.index;
			state.columnDisplayOrder.splice(oldIndex, 1);
			state.columnDisplayOrder.splice(newIndex, 0, draggableId as ColumnRole);

			// TODO:Fix this later
		},
	},
});

export const { updateColumnOrder } = columnDisplaySlice.actions;
export default columnDisplaySlice.reducer;
