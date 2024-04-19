import {
	createSlice,
	PayloadAction,
	type ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { type ProjectId } from '../../types';
import { addProject, deleteProject } from '../project/projectSlice';

interface ProjectDisplayState {
	projectDisplayOrder: ProjectId[];
	currentProjectId: ProjectId;
}

const initialState: ProjectDisplayState = {
	projectDisplayOrder: [
		'c65499e6-d946-40fc-bbe1-20bacf0fdcb8',
		'8101c117-92d4-4ee5-89a3-2723fab81fc3',
		'0f321ef5-26fc-42a9-aed0-ba9cd9e3841b',
	],
	currentProjectId: 'c65499e6-d946-40fc-bbe1-20bacf0fdcb8',
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
export const { setCurrentProject, setDisplayProjectList } =
	projectDisplaySlice.actions;
