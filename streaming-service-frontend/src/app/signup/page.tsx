'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import queries from '@/utils/queries';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/redux/store';
import { PiMusicNotesFill } from "react-icons/pi";

interface FormData {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loggedIn, userType } = useSelector((state: RootState) => state.user);
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<FormData>();
  const [role, setRole] = useState<string | undefined>();
  const [userError, setUserError] = useState<boolean>(false);
  const [artistError, setArtistError] = useState<boolean>(false);

  const [registerUser] = useMutation(queries.REGISTER_USER, {
    onCompleted: (data) => {
      const { user, token } = data.registerUser;
      setUserError(false);
      (document.getElementById('register') as HTMLFormElement)?.reset();
      //dispatch(register_re({ user, token, expiresIn: 3600, userType: 'user' }));
      router.push('/login');
    },
    onError(error) {
      setUserError(true);
    },
  });

  const [registerArtist] = useMutation(queries.REGISTER_ARTIST, {
    onCompleted: (data) => {
      const { artist, token } = data.registerArtist;
      setArtistError(false);
      (document.getElementById('register') as HTMLFormElement)?.reset();
      //dispatch(register_re({ user: artist, token, expiresIn: 3600, userType: 'artist' }));
      router.push('/login');
    },
    onError(error) {
      setArtistError(true);
    },
  });

  useEffect(() => {
    document.title = 'Sign up | Sounds 54';
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

    if (data.role === 'user') {
      setRole(data.role);
      registerUser({
        variables: {
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          email: data.email,
          password: data.password,
        }
      });
    }

    if (data.role === 'artist') {
      setRole(data.role);
      registerArtist({
        variables: {
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          email: data.email,
          password: data.password,
          genres: [],
        }
      });
    }
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
        <div className='py-10 px-10 sm:rounded-lg w-full sm:max-w-md bg-[#22333B] sm:shadow-2xl border-2 border-[#C6AC8E] rounded-lg'>
          <h1 className='text-3xl font-bold'>Sign up</h1>
          <div className='text-xl font-bold mt-4'>
            <span>Join today and dive into the world of music</span>
            {/* <PiMusicNotesFill className='inline ml-4 text-red-500 animate-bounce' />
            <PiMusicNotesFill className='inline ml-4 text-red-500 animate-bounce delay-75' />
            <PiMusicNotesFill className='inline ml-4 text-red-500 animate-bounce delay-200' /> */}
          </div>
          <div className='flex flex-col items-center mt-10 lg:w-full'>
            <form
              className='w-full'
              id='register'
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <div className='flex flex-col mb-4'>
                <label htmlFor='firstName' className='mb-1 text-sm'>
                  First Name
                </label>
                <input
                  type='text'
                  id='firstName'
                  placeholder='First Name'
                  className={`p-2 rounded-md border-2 text-black focus:outline-none focus:ring-0 ${errors?.firstName ? 'border-red-500 focus:border-red-500' : 'border-[#C6AC8E] focus:border-[#A2825D]'}`}
                  {...register('firstName', {
                    required: 'First name is required',
                    pattern: {
                      value: /^[a-zA-Z]*$/,
                      message: 'Must contain only letters',
                    },
                    minLength: {
                      value: 2,
                      message: 'Must be at least 2 characters long',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Must be less than 20 characters long',
                    },
                  })}
                />
                {errors?.firstName && (
                  <ErrorMessage message={`${errors.firstName.message}`} />
                )}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='lastName' className='mb-1 text-sm'>
                  Last Name
                </label>
                <input
                  type='text'
                  id='lastName'
                  placeholder='Last Name'
                  className={`p-2 rounded-md border-2 text-black focus:outline-none focus:ring-0 ${errors?.lastName ? 'border-red-500 focus:border-red-500' : 'border-[#C6AC8E] focus:border-[#A2825D]'}`}
                  {...register('lastName', {
                    required: 'Last name is required',
                    pattern: {
                      value: /^[a-zA-Z]*$/,
                      message: 'Must contain only letters',
                    },
                    minLength: {
                      value: 2,
                      message: 'Must be at least 2 characters long',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Must be less than 20 characters long',
                    },
                  })}
                />
                {errors?.lastName && (
                  <ErrorMessage message={`${errors.lastName.message}`} />
                )}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='displayName' className='mb-1 text-sm'>
                  Display Name
                </label>
                <input
                  type='text'
                  id='displayName'
                  placeholder='Display Name'
                  className={`p-2 rounded-md border-2 text-black focus:outline-none focus:ring-0 ${errors?.displayName ? 'border-red-500 focus:border-red-500' : 'border-[#C6AC8E] focus:border-[#A2825D]'}`}
                  {...register('displayName', {
                    required: 'Display name is required',
                    pattern: {
                      value: /^[a-zA-Z0-9 ]*$/                      ,
                      message: 'Must contain only letters and numbers',
                    },
                    minLength: {
                      value: 2,
                      message: 'Must be at least 2 characters long',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Must be less than 20 characters long',
                    },
                  })}
                />
                {errors?.displayName && (
                  <ErrorMessage message={`${errors.displayName.message}`} />
                )}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='email' className='mb-1 text-sm'>
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  placeholder='Email'
                  className={`p-2 rounded-md border-2 text-black focus:outline-none focus:ring-0 ${errors?.email ? 'border-red-500 focus:border-red-500' : 'border-[#C6AC8E] focus:border-[#A2825D]'}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      message: 'Must be a valid email',
                    },
                  })}
                />
                {errors?.email && (
                  <ErrorMessage message={`${errors.email.message}`} />
                )}
                {role === 'user' && userError && (
                  <ErrorMessage message='User already exists with this email' />
                )}
                {role === 'artist' && artistError && (
                  <ErrorMessage message='Artist already exists with this email' />
                )}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='password' className='mb-1 text-sm'>
                  Password
                </label>
                <input
                  type='password'
                  id='password'
                  placeholder='Password'
                  className={`p-2 rounded-md border-2 text-black focus:outline-none focus:ring-0 ${errors?.password ? 'border-red-500 focus:border-red-500' : 'border-[#C6AC8E] focus:border-[#A2825D]'}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Must be 8 characters long',
                    },
                    maxLength: {
                      value: 25,
                      message: 'Must be less than 25 characters long',
                    }
                  })}
                />
                {errors?.password && (
                  <ErrorMessage message={`${errors.password.message}`} />
                )}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='confirmPassword' className='mb-1 text-sm'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  placeholder='Confirm Password'
                  className={`p-2 rounded-md border-2 text-black focus:outline-none focus:ring-0 ${errors?.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-[#C6AC8E] focus:border-[#A2825D]'}`}
                  {...register('confirmPassword', {
                    required: 'Confirm password is required',
                    minLength: {
                      value: 8,
                      message: 'Must be 8 characters long',
                    },
                    maxLength: {
                      value: 25,
                      message: 'Must be less than 25 characters long',
                    },
                    validate: (value) => {
                      return (
                        getValues().password === value || 'Passwords must match'
                      );
                    }
                  })}
                />
                {errors?.confirmPassword && (
                  <ErrorMessage message={`${errors.confirmPassword.message}`} />
                )}
              </div>
              <div className='flex flex-col'>
                <label htmlFor='role' defaultValue='' className='mb-1 text-sm'>Role</label>
                <select id='role' defaultValue='' className={`px-2 py-3 rounded-md border-2 text-black focus:outline-none focus:ring-0 ${errors?.role ? 'border-red-500 focus:border-red-500' : 'border-[#C6AC8E] focus:border-[#A2825D]'}`}
                  {...register('role',
                    {
                      required: 'Select a role'
                    })}>
                  <option value='' disabled>Select a role</option>
                  <option value='user'>User</option>
                  <option value='artist'>Artist</option>
                </select>
                {errors?.role && <ErrorMessage message={`${errors.role.message}`} />}
              </div>
              <div className={errors?.role ? 'mt-10' : 'mt-16'}>
                <button
                  type='submit'
                  className='mx-auto text-center text-xl px-6 py-4 rounded-full w-full font-bold text-[#22333B] bg-[#A2825D] hover:bg-[#C6AC8E] focus:[#C6AC8E]'
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
          <div className='flex flex-col sm:flex-row justify-center items-center mt-6'>
            <p className='mr-2'>Already have an account?</p>
            <Link href='/login' className='underline'>Log in</Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default Signup;