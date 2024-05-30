



import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';
import RightPanel from './components/common/RightPanel';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import HomePage from './pages/home/HomePage';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

import Sidebar from './components/common/Sidebar';

function App() {

const {data:authUser,isLoading}  = useQuery({
queryKey:['authUser'],
queryFn : async ()=>{

try{
const res= await fetch('/api/auth/me')
 const data = await res.json();
 if(data.error) return null;
 if (!res.ok ) throw new Error(data.message || "error occured during fetching data in res block");

 console.log("authUser is here:", data);  
return data;



}
catch(e){
throw new Error(e.message || "error occured during fetching data in catch block");

}

},



});






if(isLoading){

return(
<div className='h-screen flex justify-center items-center'>
<LoadingSpinner  size="lg"/> 
</div>



)

}




  return (
    <div className="flex mx-auto max-w-6xl h-screen">   
 
{ authUser && < Sidebar  />}
 
 <Routes>
			<Route path='/' element={authUser ? <HomePage/>: <Navigate to="/login" />}/>
			<Route path='/signup' element={ !authUser ?<SignUpPage/> :<Navigate to="/" />} />
      <Route path='/login' element={!authUser ? <LoginPage/>:<Navigate to="/" />  } />
			<Route path='/notifications' element={authUser ?<NotificationPage/> : <Navigate to="/login" />} />
      <Route path='/profile/:username' element={authUser ?<ProfilePage/>  : <Navigate to="/login" />} />
			</Routes>

      {authUser && <RightPanel />}  
    <Toaster />
    </div>
  );
}

export default App;
