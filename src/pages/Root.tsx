import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase-config';
import { userLoggedIn, userLoggedOut } from '../features/user/userSlice';
import { useAppDispatch } from '../hooks/useHooks';
import Loading from './Loading';
import { fetchLists } from '../features/list/listSlice';
import { useAppSelector } from '../hooks/useHooks';
import { fetchColumnsByUserId } from '../features/column/columnSlice';
import { fetchTasks } from '../features/task/taskSlice';
export default function Root() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userId = useAppSelector((state) => state.user.userId);

  useEffect(() => {
    // An listener that listens for changes in the authentication state.
    // If the user is logged in, fetch the user's lists.
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          userLoggedIn({
            userId: user.uid,
            status: 'loggedIn',
          }),
        );
        console.log('fetching lists');
        console.log(user);
        dispatch(fetchLists(user.uid));
        dispatch(fetchColumnsByUserId(user.uid));
        dispatch(fetchTasks(user.uid));
        navigate('/app');
      } else {
        dispatch(userLoggedOut());
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [dispatch, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {!userId && (
        <div className="flex gap-4">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
      <Outlet />
    </>
  );
}
