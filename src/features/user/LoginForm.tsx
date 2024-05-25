import { FormEvent, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useHooks';
import { useNavigate } from 'react-router-dom';
import { firebaseLogin } from '../user/userSlice';
export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authStatus = useSelector((state: RootState) => state.user.status);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (authStatus === 'loggedIn') {
      console.log('loggedIn');
      // navigate('/Focus/app', { replace: true });
      navigate('/app');
    }
  }, [authStatus, navigate]);
  const login = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(firebaseLogin({ email, password }));
  };
  return (
    <div>
      Login
      <form action="" method="post" onSubmit={login} autoComplete="off">
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          id="current-email"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="current-password"
          placeholder="Enter Password"
          value={password}
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="ml-2 border p-4 hover:bg-slate-500">
          Login
        </button>
      </form>
    </div>
  );
}
