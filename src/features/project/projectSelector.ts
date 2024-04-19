import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { type ProjectId, type Project } from '../../types';

// Selector to access the projects record from the state
const selectProjects = (state: RootState) => state.project.projects;

// Selector to access the project display order from the state
const selectProjectOrder = (state: RootState) =>
	state.projectDisplay.projectDisplayOrder;

// Create a memoized selector that maps the ordered project IDs to their project details
export const selectOrderedProjects = createSelector(
	[selectProjects, selectProjectOrder],
	(projects: Record<ProjectId, Project>, projectOrder: ProjectId[]) => {
		console.log('selectOrderedProjects is called');
		console.log(
			'If this is called when you drag the project, it means this set up is not working'
		);
		return projectOrder.map((id: ProjectId) => projects[id]);
	}
);
