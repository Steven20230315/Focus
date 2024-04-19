import {
	createSlice,
	PayloadAction,
	type ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { type ProjectId, type Project } from '../../types';
import { addProject, deleteProject } from '../project/projectSlice';
import { type DropResult } from '@hello-pangea/dnd';

interface ProjectDisplayState {
	projectDisplayOrder: ProjectId[];
	currentProjectId: ProjectId | null;
}

interface DropResultWithProjectId extends DropResult {
	projectId: ProjectId;
}

const initialState: ProjectDisplayState = {
	projectDisplayOrder: [],
	currentProjectId: null,
};

// Info for how to display projects: 1. The order of the projects in the sidebar. 2. The current project in the view
const projectDisplaySlice = createSlice({
	name: 'projectDisplay',
	initialState,
	reducers: {
		setCurrentProject: (
			state: ProjectDisplayState,
			action: PayloadAction<ProjectId>
		) => {
			state.currentProjectId = action.payload;
		},
		setDisplayProjectList: (
			state: ProjectDisplayState,
			action: PayloadAction<ProjectId[]>
		) => {
			state.projectDisplayOrder = action.payload;
		},
		updateProjectOrder: (
			state: ProjectDisplayState,
			action: PayloadAction<DropResultWithProjectId>
		) => {
			const { source, destination, projectId, draggableId } = action.payload;
			if (!destination) {
				console.log('Destination is undefined');
				return;
			}
			// The project list only has one legal droppable area, the sidebar
			// If the source and destination are not in the same droppable area, return
			if (source.droppableId !== destination.droppableId) {
				console.log('The only legal droppable area is the sidebar');
			} else {
				const oldIndex = source.index;
				const newIndex = destination.index;
				state.projectDisplayOrder.splice(oldIndex, 1);
				state.projectDisplayOrder.splice(newIndex, 0, projectId);
			}
		},
	},
	extraReducers: (builder: ActionReducerMapBuilder<ProjectDisplayState>) => {
		// Add new project to projectDisplayOrder
		builder.addCase(
			addProject,
			(state: ProjectDisplayState, action: PayloadAction<Project>) => {
				console.log('addProject is called in projectDisplaySlice');

				if (!state.projectDisplayOrder.includes(action.payload.projectId)) {
					state.projectDisplayOrder.push(action.payload.projectId);
				}
				console.log(state.projectDisplayOrder);
			}
		);
		builder.addCase(
			// Delete project from projectDisplayOrder
			deleteProject,
			(state: ProjectDisplayState, action: PayloadAction<ProjectId>) => {
				const index = state.projectDisplayOrder.indexOf(action.payload);
				if (index !== -1) {
					state.projectDisplayOrder.splice(index, 1);
				}
			}
		);
	},
});

export default projectDisplaySlice.reducer;
export const { setCurrentProject, setDisplayProjectList, updateProjectOrder } =
	projectDisplaySlice.actions;
