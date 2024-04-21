import { configureStore } from '@reduxjs/toolkit';
import listSlice from './features/list/listSlice';
import columnSlice from './features/column/columnSlice';
import taskSlice from './features/task/taskSlice';
export const store = configureStore({
	reducer: {
		list: listSlice,
		column: columnSlice,
		task: taskSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
