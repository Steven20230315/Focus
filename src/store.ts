import { configureStore } from '@reduxjs/toolkit';
import projectDisplaySlice from './features/projectDisplay/projectDisplaySlice';
import projectSlice from './features/project/projectSlice';

export const store = configureStore({
	reducer: {
		projectDisplay: projectDisplaySlice,
		project: projectSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
