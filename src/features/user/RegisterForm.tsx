import { FormEvent, useState } from 'react';
import { auth, db } from '../../firebase/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const login = async (e: FormEvent) => {
    e.preventDefault();
    const user = await createUserWithEmailAndPassword(auth, email, password);

    if (user) {
      console.log('User created successfully!');
      console.log(user);
      const docRef = await addDoc(collection(db, 'users'), {
        uid: user.user.uid,
        email: user.user.email,
        listIds: [],
      });

      console.log('Document written with ID: ', docRef.id);
      navigate('/login');
    }
  };
  return (
    <div>
      <form action="" onSubmit={login} autoComplete="off">
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          id="register-email"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="register-password"
          placeholder="Enter Password"
          value={password}
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
