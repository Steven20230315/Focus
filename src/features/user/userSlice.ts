import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../firebase/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ListId } from '../../types';

export type User = {
  uid: string;
  email: string;
  listIds: ListId[];
};

type UserState = {
  userId: string | undefined | null;
  status: 'loggedIn' | 'notLoggedIn' | 'loading';
};

const initialState: UserState = {
  userId: undefined,
  status: 'notLoggedIn',
};

export const firebaseLogin = createAsyncThunk('user/login', async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
    return user;
  } catch (error) {
    console.dir(error);
    throw error;
  }
  // const userCollectionRef = collection
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.status = action.payload.status;
      state.userId = action.payload.userId;
    },
    userLoggedOut: (state) => {
      state.status = 'notLoggedIn';
      state.userId = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(firebaseLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(firebaseLogin.fulfilled, (state, action) => {
        state.status = 'loggedIn';
        state.userId = action.payload?.user?.uid;
      })
      .addCase(firebaseLogin.rejected, (state) => {
        state.status = 'notLoggedIn';
        state.userId = undefined;
      });
  },
});

export default userSlice.reducer;
export const { userLoggedIn, userLoggedOut } = userSlice.actions;
