import { default as LoginForm } from '../features/user/LoginForm.tsx';

export default function Login() {
  return (
    <div className="flex h-screen flex-col items-center ">
      <h1 className="text-4xl font-bold">This is log in page</h1>
      <LoginForm />
    </div>
  );
}
