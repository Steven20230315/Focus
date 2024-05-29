import React from 'react';
import ReactDOM from 'react-dom/client';
import { persistor, store } from './store.ts';
import { Provider } from 'react-redux';
import './input.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login, Register, App, Root, Test } from './pages';
import { PersistGate } from 'redux-persist/integration/react';
import ProtectedRoute from './features/user/ProtectedRoute.tsx';
const router = createBrowserRouter(
  [
    {
      path: '',
      element: <Root />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
        {
          path: 'app',
          element: <ProtectedRoute />,
          children: [{ path: '', element: <App /> }],
        },
        {
          path: 'test',
          element: <Test />,
        },
      ],
    },
  ],
  {
    basename: '/Focus/',
  },
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading</div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
