'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import queries from '@/utils/queries';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/redux/store';
import { login } from '@/utils/redux/features/user/userSlice';
import Cookies from 'js-cookie';

interface FormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loggedIn, userType } = useSelector((state: RootState) => state.user);
  const { handleSubmit, register } = useForm<FormData>();
  const [adminError, setAdminError] = useState<boolean>(false);

  const [loginAdmin] = useMutation(queries.LOGIN_ADMIN, {
    onCompleted: (data: any) => {
      const { admin, token } = data.loginAdmin;
      setAdminError(false);
      (document.getElementById('login') as HTMLFormElement)?.reset();
      dispatch(login({ user: admin, token, expiresIn: 3600, userType: 'admin' }));
      Cookies.set('token', token, { expires: 7, secure: true });
      Cookies.set('userType', 'artist', { expires: 7, secure: true });
      router.push('/admin/dashboard');
    },
    onError(error) {
      setAdminError(true);
    }
  });

  useEffect(() => {
    document.title = 'Login | Sounds 54';
  }, []);

  useEffect(() => {
    if (loggedIn && userType === 'admin') {
      router.push('/admin/dashboard');
    }

    if (loggedIn && userType === 'user') {
      router.push('/sound');
    }

    if (loggedIn && userType === 'artist') {
      router.push('/artist');
    }
  }, [loggedIn, router]);

  const handleOnSubmit: SubmitHandler<FormData> = (data, event) => {
    event?.preventDefault();

    loginAdmin({
      variables: {
        email: data.email,
        password: data.password
      }
    });
  };

  if (loggedIn && (userType === 'admin' || userType === 'user' || userType === 'artist')) {
    return (
      <div className='text-4xl flex justify-center items-center h-full text-[#22333B] bg-[#C6AC8E]'>
        <span className='mr-2'>Loading</span>
        <span className='animate-bounce'>.</span>
        <span className='animate-bounce delay-75'>.</span>
        <span className='animate-bounce delay-200'>.</span>
      </div>
    );
  }

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
                <label htmlFor='email' className='mb-1 text-sm'>Email</label>
                <input type='email' id='email' placeholder='Email' className='px-2 py-2 rounded-md border-2 border-[#C6AC8E] text-black focus:border-[#A2825D] focus:outline-none focus:ring-0'
                  {...register('email', { required: true })} />
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='password' className='mb-1 text-sm'>Password</label>
                <input type='password' id='password' placeholder='Password' className='px-2 py-2 rounded-md border-2 border-[#C6AC8E] text-black focus:border-[#A2825D] focus:outline-none focus:ring-0'
                  {...register('password', { required: true })} />
              </div>
              <div>
                {adminError && <ErrorMessage message='Login Failed: Invalid email or password' />}
              </div>
              <div className={adminError ? 'mt-6' : 'mt-16'}>
                <button type='submit' className='mx-auto text-center text-xl px-6 py-4 rounded-full w-full font-bold text-[#22333B] bg-[#A2825D] hover:bg-[#C6AC8E] focus:[#C6AC8E]'>Log in</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminLogin;