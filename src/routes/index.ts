import React from 'react';
import PathConstants from './PathConstants';

const Register = React.lazy(() => import('../pages/Register'));
const Login = React.lazy(() => import('../pages/Login'));
const App = React.lazy(() => import('../pages/App'));

const routes = [
  {
    path: PathConstants.REGISTER,
    component: Register,
  },
  {
    path: PathConstants.LOGIN,
    component: Login,
  },
  {
    path: PathConstants.APP,
    component: App,
  },
];

export default routes;
