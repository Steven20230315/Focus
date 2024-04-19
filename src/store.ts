import { configureStore } from '@reduxjs/toolkit';
import projectDisplaySlice from './features/projectDisplay/projectDisplaySlice';
import projectSlice from './features/project/projectSlice';
import columnSlice from './features/column/columnSlice';
import columnDisplaySlice from './features/columnDisplay/columnDisplaySlice';
export const store = configureStore({
	reducer: {
		projectDisplay: projectDisplaySlice,
		project: projectSlice,
		// column: columnSlice,
		columnDisplay: columnDisplaySlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
