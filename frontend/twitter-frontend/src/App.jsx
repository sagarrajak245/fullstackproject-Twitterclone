



import { Route, Routes } from 'react-router-dom';
import RightPanel from './components/common/RightPanel';
import Sidebar from './components/common/Sidebar';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import HomePage from './pages/home/HomePage';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';



function App() {
  return (
    <div className="flex mx-auto max-w-6xl h-screen">   
 
 <Sidebar />
 
 <Routes>
				<Route path='/' element={<HomePage/>} />
				<Route path='/signup' element={<SignUpPage/>} />
        <Route path='/login' element={<LoginPage/>} />
			<Route path='/notifications' element={<NotificationPage/>} />
      <Route path='/profile' element={<ProfilePage/>} />
			</Routes>

    <RightPanel />  
    </div>
  );
}

export default App;
