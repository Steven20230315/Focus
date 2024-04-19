import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Project, type ProjectId } from '../../types';
// Project slice is responsible for managing projects (CRUD operations)
interface ProjectState {
	projects: Record<ProjectId, Project>;
}

// Initial state for projects
const initialState: ProjectState = {
	projects: {},
};

const projectSlice = createSlice({
	name: 'project',
	initialState,
	reducers: {
		addProject: (state: ProjectState, action: PayloadAction<Project>) => {
			state.projects[action.payload.projectId] = action.payload;
		},
		deleteProject: (state: ProjectState, action: PayloadAction<ProjectId>) => {
			if (!(action.payload in state.projects)) {
				throw new Error('The project you want to delete does not exist');
			} else {
				delete state.projects[action.payload];
			}
		},
		updateProject: (state: ProjectState, action: PayloadAction<Project>) => {
			if (!(action.payload.projectId in state.projects)) {
				throw new Error('The project you want to update does not exist');
			} else {
				state.projects[action.payload.projectId] = action.payload;
			}
		},
	},
});

export const { addProject, deleteProject, updateProject } =
	projectSlice.actions;
export default projectSlice.reducer;
