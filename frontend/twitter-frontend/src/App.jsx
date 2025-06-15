import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';
import RightPanel from './components/common/RightPanel';
import Sidebar from './components/common/Sidebar';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import HomePage from './pages/home/HomePage';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  // 🌙 Apply dark theme and DaisyUI's "black" theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'black'); // DaisyUI theme
    document.documentElement.classList.add('dark'); // Tailwind dark mode
  }, []);

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (data.error) return null;
        if (!res.ok) throw new Error(data.message || 'Error during fetch');
        console.log('authUser is here:', data);
        return data;
      } catch (e) {
        throw new Error(e.message || 'Error in fetch catch block');
      }
    },
  });

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className='flex mx-auto max-w-6xl h-screen'>
      {authUser && <Sidebar />}

      <Routes>
        <Route
          path='/'
          element={authUser ? <HomePage /> : <Navigate to='/login' />}
        />
        <Route
          path='/signup'
          element={!authUser ? <SignUpPage /> : <Navigate to='/' />}
        />
        <Route
          path='/login'
          element={!authUser ? <LoginPage /> : <Navigate to='/' />}
        />
        <Route
          path='/notifications'
          element={authUser ? <NotificationPage /> : <Navigate to='/login' />}
        />
        <Route
          path='/profile/:username'
          element={authUser ? <ProfilePage /> : <Navigate to='/login' />}
        />
      </Routes>

      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
