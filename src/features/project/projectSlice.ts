import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Project, type ProjectId } from '../../types';
import { createID } from '../../utils/createID';
// Project slice is responsible for managing projects (CRUD operations)
interface ProjectState {
	projects: Record<ProjectId, Project>;
}

// Initial state for projects
const initialState: ProjectState = {
	projects: {
		'c65499e6-d946-40fc-bbe1-20bacf0fdcb8': {
			title: 'Project 1',
			projectId: 'c65499e6-d946-40fc-bbe1-20bacf0fdcb8',
		},
		'8101c117-92d4-4ee5-89a3-2723fab81fc3': {
			title: 'Project 2',
			projectId: '8101c117-92d4-4ee5-89a3-2723fab81fc3',
		},
		'0f321ef5-26fc-42a9-aed0-ba9cd9e3841b': {
			title: 'Project 3',
			projectId: '0f321ef5-26fc-42a9-aed0-ba9cd9e3841b',
		},
	},
};

type AddProjectPayload = {
	title: string;
};

const projectSlice = createSlice({
	name: 'project',
	initialState,
	reducers: {
		addProject: (
			state: ProjectState,
			action: PayloadAction<AddProjectPayload>
		) => {
			const id = createID();
			state.projects[id] = {
				...action.payload,
				projectId: id,
			};
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
