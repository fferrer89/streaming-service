import { useDispatch } from 'react-redux';
import { logout } from '@/utils/redux/features/user/userSlice';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove('token');
    Cookies.remove('userType');
    router.push('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
