import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import listSlice from './features/list/listSlice';
import columnSlice from './features/column/columnSlice';
import taskSlice from './features/task/taskSlice';
import timerSlice from './features/timer/timerSlice';
import userSlice from './features/user/userSlice';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'user',
  storage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, userSlice);

// const loggerMiddleware = (store) => (next) => (action) => {
//   console.log('Dispatching action:', action);
//   const result = next(action);
//   console.log('Next state:', store.getState());
//   return result;
// };
export const store = configureStore({
  reducer: {
    list: listSlice,
    column: columnSlice,
    task: taskSlice,
    timer: timerSlice,
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
