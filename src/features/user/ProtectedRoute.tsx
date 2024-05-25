import { useAppSelector } from '../../hooks/useHooks';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const userStatus = useAppSelector((state) => state.user.status);

  if (userStatus !== 'loggedIn') {
    // Redirect them to the login page if not logged in
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Render children routes if logged in
}

export default ProtectedRoute;
