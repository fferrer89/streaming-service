'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import queries from '@/utils/queries';
import { useForm, SubmitHandler } from 'react-hook-form';

interface FormData {
  email: string;
  password: string;
  role: string;
}

export default function Login() {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors } } = useForm<FormData>();
  const [role, setRole] = useState<string | undefined>();
  const [userError, setUserError] = useState<boolean>(false);
  const [artistError, setArtistError] = useState<boolean>(false);

  const [loginUser] = useMutation(queries.LOGIN_USER, {
    onCompleted: (data: any) => {
      const { token } = data.loginUser;
      document.cookie = `token=${token}; SameSite=Strict; Strict path=/`;
      setUserError(false);
      (document.getElementById('login') as HTMLFormElement)?.reset();
      router.push('/sounds');
    },
    onError(error: any) {
      setUserError(true);
    }
  });

  const [loginArtist] = useMutation(queries.LOGIN_ARTIST, {
    onCompleted: (data: any) => {
      const { token } = data.loginArtist;
      document.cookie = `token=${token}; SameSite=Strict; Strict path=/`;
      setArtistError(false);
      (document.getElementById('login') as HTMLFormElement)?.reset();
      router.push('/artist/dashboard');
    },
    onError(error: any) {
      setArtistError(true);
    }
  });
  useEffect(() => {
    document.title = 'Login | Sounds 54';
  }, []);

  const handleOnSubmit: SubmitHandler<FormData> = (data, event) => {
    event?.preventDefault();

    if (data.role === 'user') {
      setRole(data.role);
      loginUser({
        variables: {
          email: data.email,
          password: data.password
        }
      });
    }

    if (data.role === 'artist') {
      setRole(data.role);
      loginArtist({
        variables: {
          email: data.email,
          password: data.password
        }
      });
    }
  };

  const ErrorMessage = ({ message }: { message: string }) => (
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
                <input type='email' id='email' placeholder='Email' className='px-2 py-2 rounded-md border-2 border-black text-black'
                  {...register('email', { required: true })} />
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='password' className='mb-1 text-sm'>Password</label>
                <input type='password' id='password' placeholder='Password' className='px-2 py-2 rounded-md border-2 border-black text-black'
                  {...register('password', { required: true })} />
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='role' className='mb-1 text-sm'>Role</label>
                <select id='role' defaultValue='' className='px-2 py-3 rounded-md border-2 border-black text-black'
                  {...register('role',
                    {
                      required: 'Select a role'
                    })}>
                  <option value='' disabled>Select a role</option>
                  <option value='user'>User</option>
                  <option value='artist'>Artist</option>
                </select>
                {errors?.role && <ErrorMessage message={errors.role.message as string} />}
              </div>
              <div>
                {(role === 'user') && userError && <ErrorMessage message='Login Failed: Invalid email or password' />}
                {(role === 'artist') && artistError && <ErrorMessage message='Login Failed: Invalid email or password' />}
              </div>
              <div className={(userError || artistError || errors?.role) ? 'mt-6' : 'mt-16'}>
                <button type='submit' className='mx-auto text-center text-xl px-6 py-4 rounded-full w-full bg-[#a2825d] hover:bg-[#C6AC8E] focus:[#C6AC8E]'>Log in</button>
              </div>
            </form>
          </div>
          <div className='flex flex-col sm:flex-row justify-center items-center mt-6'>
            <p className='mr-2'>New to Sound 53?</p>
            <Link href='/signup' className='underline'>Sign up</Link>
          </div>
        </div>
      </main>
    </>
  );
}