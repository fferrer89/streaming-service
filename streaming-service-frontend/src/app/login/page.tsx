'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import queries from '@/utils/queries';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '@/utils/redux/features/user/userSlice';

interface FormData {
  email: string;
  password: string;
  role: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors } } = useForm<FormData>();
  const [role, setRole] = useState<string | undefined>();
  const [userError, setUserError] = useState<boolean>(false);
  const [artistError, setArtistError] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [loginUser, { error: userDataError }] = useMutation(queries.LOGIN_USER, {
    onCompleted: (data: any) => {
      const { user, token } = data.loginUser;
      setUserError(false);
      (document.getElementById('login') as HTMLFormElement)?.reset();
      dispatch(login({ user, token, expiresIn: 3600, userType: 'user' }));
      router.push('/sound');
    },
    onError(error: any) {
      setUserError(true);
    }
  });

  const [loginArtist, { error: artistDataError }] = useMutation(queries.LOGIN_ARTIST, {
    onCompleted: (data: any) => {
      const { artist, token } = data.loginArtist;
      setArtistError(false);
      (document.getElementById('login') as HTMLFormElement)?.reset();
      dispatch(login({ user: artist, token, expiresIn: 3600, userType: 'artist' }));
      router.push('/artist/dashboard');
    },
    onError(error: any) {
      setArtistError(true);
    },
  });

  useEffect(() => {
    document.title = 'Login | Sounds 54';
  }, []);

  if (userDataError || artistDataError) {
    return <div>Error: {userDataError?.message || artistDataError?.message}</div>
  }

  const handleOnSubmit: SubmitHandler<FormData> = (data, event) => {
    event?.preventDefault();

    if (data.role === 'user') {
      setRole(data.role);
      loginUser({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
    }

    if (data.role === 'artist') {
      setRole(data.role);
      loginArtist({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
    }
  };

  const ErrorMessage = ({ message }: { message: string }) => (
    <p className='text-sm mt-2 text-red-500 inline-block'>{message}</p>
  );

  return (
    <>
      <main className='flex flex-col justify-center items-center py-10 text-[#C6AC8E]'>
        <div className='py-10 px-10 sm:rounded-lg w-full sm:max-w-md bg-[#22333B] sm:shadow-2xl'>
          <h1 className='text-3xl font-bold'>Log in to Sounds 54</h1>
          <div className='flex flex-col items-center mt-10 lg:w-full'>
            <form className='w-full' id='login' onSubmit={handleSubmit(handleOnSubmit)}>
              <div className='flex flex-col mb-4'>
                <label htmlFor='email' className='mb-1 text-sm'>
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  placeholder='Email'
                  className='px-2 py-2 rounded-md border-2 border-[#C6AC8E] text-black focus:border-[#A2825D] focus:outline-none focus:ring-0'
                  {...register('email', { required: true })}
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='password' className='mb-1 text-sm'>
                  Password
                </label>
                <input
                  type='password'
                  id='password'
                  placeholder='Password'
                  className='px-2 py-2 rounded-md border-2 border-[#C6AC8E] text-black focus:border-[#A2825D] focus:outline-none focus:ring-0'
                  {...register('password', { required: true })}
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='role' className='mb-1 text-sm'>
                  Role
                </label>
                <select
                  id='role'
                  defaultValue=''
                  className='px-2 py-3 rounded-md border-2 border-[#C6AC8E] text-black focus:border-[#A2825D] focus:outline-none focus:ring-0'
                  {...register('role', {
                    required: 'Select a role',
                  })}
                >
                  <option value='' disabled>
                    Select a role
                  </option>
                  <option value='user'>User</option>
                  <option value='artist'>Artist</option>
                </select>
                {errors?.role && <ErrorMessage message={errors.role.message as string} />}
              </div>
              <div>
                {role === 'user' && userError && (
                  <ErrorMessage message='Login Failed: Invalid email or password' />
                )}
                {role === 'artist' && artistError && (
                  <ErrorMessage message='Login Failed: Invalid email or password' />
                )}
              </div>
              <div className={userError || artistError || errors?.role ? 'mt-6' : 'mt-16'}>
                <button
                  type='submit'
                  className='mx-auto text-center text-xl px-6 py-4 rounded-full w-full font-bold text-[#22333B] bg-[#A2825D] hover:bg-[#C6AC8E] focus:[#C6AC8E]'
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
          <div className='flex flex-col sm:flex-row justify-center items-center mt-6'>
            <p className='mr-2'>New to Sounds 54?</p>
            <Link href='/signup' className='underline'>
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;