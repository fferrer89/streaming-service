'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import queries from '@/queries.js';
import { useForm } from 'react-hook-form';

export default function Signup() {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors }, getValues } = useForm();
  const [role, setRole] = useState();
  const [userError, setUserError] = useState(false);
  const [artistError, setArtistError] = useState(false);

  const [registerUser] = useMutation(queries.REGISTER_USER, {
    onCompleted: () => {
      setUserError(false);
      document.getElementById('register').reset();
      router.push('/login');
    },
    onError(error) {
      setUserError(true);
    }
  });

  const [registerArtist] = useMutation(queries.REGISTER_ARTIST, {
    onCompleted: () => {
      setArtistError(false);
      document.getElementById('register').reset();
      router.push('/login');
    },
    onError(error) {
      setArtistError(true);
    }
  });

  useEffect(() => {
    document.title = 'Sound 53 | Sign Up'
  }, []);

  const handleOnSubmit = (data, event) => {
    event.preventDefault();

    if (data.role === 'user') {
      setRole(data.role);
      registerUser({
        variables: {
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          email: data.email,
          password: data.password,
          profileImageUrl: 'example.com'
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
          profileImageUrl: 'example.com',
          genres: []
        }
      });
    }
  };

  const ErrorMessage = ({ message }) => (
    <p className='text-sm mt-2 text-red-500 inline-block'>{message}</p>
  );

  return (
    <>
      <main className='flex flex-col justify-center items-center py-10 text-white'>
        <div className='py-10 px-12 rounded-md lg:w-1/3 bg-black'>
          <h1 className='flex text-3xl font-bold'>Sign Up <p className='ml-4 text-red-500 rotate-12'>&#9835;</p></h1>
          <div className='flex flex-col items-center mt-6 lg:w-full'>
            <form className='w-full' id='register' onSubmit={handleSubmit(handleOnSubmit)}>
              <div className='flex flex-col mb-4'>
                <label htmlFor='firstName' className='mb-1 text-sm'>First Name</label>
                <input type='text' name='firstName' id='firstName' placeholder='First Name' className='px-2 py-2 rounded-sm text-black'
                  {...register('firstName',
                    {
                      required: 'First name is required',
                      pattern: { value: /^[a-zA-Z]*$/, message: 'Must contain only letters' },
                      minLength: { value: 2, message: 'Must be at least 2 characters long' },
                      maxLength: { value: 20, message: 'Must be less than 20 characters long' }
                    })} />
                {errors?.firstName && <ErrorMessage message={errors.firstName.message} />}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='lastName' className='mb-1 text-sm'>Last Name</label>
                <input type='text' name='lastName' id='lastName' placeholder='Last Name' className='px-2 py-2 rounded-sm text-black'
                  {...register('lastName',
                    {
                      required: 'Last name is required',
                      pattern: { value: /^[a-zA-Z]*$/, message: 'Must contain only letters' },
                      minLength: { value: 2, message: 'Must be at least 2 characters long' },
                      maxLength: { value: 20, message: 'Must be less than 20 characters long' }
                    })} />
                {errors?.lastName && <ErrorMessage message={errors.lastName.message} />}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='displayName' className='mb-1 text-sm'>Display Name</label>
                <input type='text' name='displayName' id='displayName' placeholder='Display Name' className='px-2 py-2 rounded-sm text-black'
                  {...register('displayName',
                    {
                      required: 'Display name is required',
                      pattern: { value: /^[a-zA-Z0-9]*$/, message: 'Must contain only letters and numbers' },
                      minLength: { value: 2, message: 'Must be at least 2 characters long' },
                      maxLength: { value: 20, message: 'Must be less than 20 characters long' }
                    })} />
                {errors?.displayName && <ErrorMessage message={errors.displayName.message} />}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='email' className='mb-1 text-sm'>Email</label>
                <input type='email' name='email' id='email' placeholder='Email' className='px-2 py-2 rounded-sm text-black'
                  {...register('email',
                    {
                      required: 'Email is required',
                      pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: 'Must be a valid email' }
                    })} />
                {errors?.email && <ErrorMessage message={errors.email.message} />}
                {(role === 'user') && userError && <ErrorMessage message='User already exists with this email' />}
                {(role === 'artist') && artistError && <ErrorMessage message='Artist already exists with this email' />}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='password' className='mb-1 text-sm'>Password</label>
                <input type='password' name='password' id='password' placeholder='Password' className='px-2 py-2 rounded-sm text-black'
                  {...register('password',
                    {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Must be 8 characters long' },
                      maxLength: { value: 25, message: 'Must be less than 25 characters long' }
                    })} />
                {errors?.password && <ErrorMessage message={errors.password.message} />}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='confirmPassword' className='mb-1 text-sm'>Confirm Password</label>
                <input type='password' name='confirmPassword' id='confirmPassword' placeholder='Confirm Password' className='px-2 py-2 rounded-sm text-black'
                  {...register('confirmPassword',
                    {
                      required: 'Confirm password is required',
                      minLength: { value: 8, message: 'Must be 8 characters long' },
                      maxLength: { value: 25, message: 'Must be less than 25 characters long' },
                      validate: (value) => { return getValues().password === value || 'Passwords must match' }
                    })} />
                {errors?.confirmPassword && <ErrorMessage message={errors.confirmPassword.message} />}
              </div>
              <div className='flex flex-col mb-8'>
                <label htmlFor="role" defaultValue='' className='mb-1 text-sm'>Role</label>
                <select name="role" id="role" defaultValue='' className='px-2 py-3 rounded-sm text-black'
                  {...register('role',
                    {
                      required: 'Select a role'
                    })}>
                  <option value="" disabled>Select a role</option>
                  <option value="user">User</option>
                  <option value="artist">Artist</option>
                </select>
                {errors?.role && <ErrorMessage message={errors.role.message} />}
              </div>
              <div>
                <button type='submit' className='mx-auto text-center px-6 py-4 rounded-full bg-green-500 w-full'>Sign Up</button>
              </div>
            </form>
          </div>
          <div className='flex justify-center mt-6'>
            <p className='mr-1'>Already have an account?</p>
            <Link href='/login' className='underline'>Log in</Link>
          </div>
        </div>
      </main>
    </>
  );
}