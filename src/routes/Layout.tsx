import { MemoryRouter } from 'react-router-dom';
import { useAppSelector } from '../hooks/useHooks';

export default function Layout({ children }: { children: React.ReactNode }) {
  const userStatus = useAppSelector((state) => state.user.status);
  return (
    <MemoryRouter initialEntries={[userStatus === 'loggedIn' ? '/Focus/app' : '/Focus/']}>{children}</MemoryRouter>
  );
}
