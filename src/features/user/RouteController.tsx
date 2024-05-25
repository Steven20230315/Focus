import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector } from '../../hooks/useHooks';
function RouteController() {
  const userStatus = useAppSelector((state) => state.user.status);
  const navigate = useNavigate();

  useEffect(() => {
    if (userStatus === 'loggedIn') {
      navigate('/Focus/app');
    } else {
      navigate('/Focus/');
    }
  }, [userStatus, navigate]);

  return null; // This component does not render anything, it just controls routing
}

export default RouteController;
