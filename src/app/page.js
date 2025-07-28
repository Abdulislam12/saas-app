'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/redux/auth/authActions';
import Loader from '../app/components/Loader';
import Form from './components/Form/Form';

import {
  buttonPrimary,
  pageWrapper,
  cardContainer,
  headingText,
  textCenter,
} from '@/styles/theme';

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace('/login');
  };

  if (loading || !isAuthenticated) {
    return <Loader />;
  }

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 text-white py-3 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-bold">MyApp</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block">
            Welcome, {user?.name || 'User'}
          </span>
          <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 text-sm font-semibold transition">
            Logout
          </button>
        </div>
      </nav>

      <Form />
    </>
  );
};

export default Page;
