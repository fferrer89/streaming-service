'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import queries from '@/utils/queries';
import { useForm } from 'react-hook-form';

export default function Login() {
  const router = useRouter();
  const { handleSubmit, register } = useForm();
  const [adminError, setAdminError] = useState(false);

  const [loginAdmin] = useMutation(queries.LOGIN_ADMIN, {
    onCompleted: (data) => {
      const { token } = data.loginAdmin;
      document.cookie = `token=${token}; SameSite=Strict; Strict path=/`;
      setAdminError(false);
      document.getElementById('login').reset();
      router.push('/admin/dashboard');
    },
    onError(error) {
      setAdminError(true);
    }
  });

  useEffect(() => {
    document.title = 'Login | Sounds 54'
  }, []);

  const handleOnSubmit = (data, event) => {
    event.preventDefault();

    loginAdmin({
      variables: {
        email: data.email,
        password: data.password
      }
    });
  };

  const ErrorMessage = ({ message }) => (
    <p className='text-sm mt-2 text-red-500 inline-block'>{message}</p>
  );

  return (
    <>
      <main className='flex flex-col justify-center items-center py-10 text-black'>
        <div className='py-10 px-10 rounded-lg w-full sm:max-w-md bg-white sm:shadow-2xl'>
          <h1 className='text-3xl font-bold'>Log in to Sounds 54</h1>
          <div className='flex flex-col items-center mt-10 lg:w-full'>
            <form className='w-full' id='login' onSubmit={handleSubmit(handleOnSubmit)}>
              <div className='flex flex-col mb-4'>
                <label htmlFor='email' className='mb-1 text-sm'>Email</label>
                <input type='email' name='email' id='email' placeholder='Email' className='px-2 py-2 rounded-md border-2 border-black text-black'
                  {...register('email', { required: true })} />
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='password' className='mb-1 text-sm'>Password</label>
                <input type='password' name='password' id='password' placeholder='Password' className='px-2 py-2 rounded-md border-2 border-black text-black'
                  {...register('password', { required: true })} />
              </div>
              <div>
                {adminError && <ErrorMessage message='Login Failed: Invalid email or password' />}
              </div>
              <div className={adminError ? 'mt-6' : 'mt-16'}>
                <button type='submit' className='mx-auto text-center text-xl px-6 py-4 rounded-full w-full bg-green-500 hover:bg-green-400 focus:bg-green-400'>Log in</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}