import './App.css';
import LoginForm from './LoginComponent/UserLogin/LoginForm.jsx';
import SignupForm from './LoginComponent/UserLogin/SignupForm.jsx';
import SuperAdminLogin from './LoginComponent/SuperAdminLogin/LoginForm.jsx';
import SuperAdminRegister from './LoginComponent/SuperAdminLogin/SignupForm.jsx';
import AdminLogin from './LoginComponent/AdminLogin/LoginForm.jsx';
import SuperAdminCreateRegister from './LoginComponent/AdminLogin/CreateAdminForm.jsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateAdminForm from './LoginComponent/AdminLogin/CreateAdminForm.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/user-register' element={<SignupForm />} />
          <Route path='/user-login' element={<LoginForm/>}/>
          <Route path='/super-admin-login' element={<SuperAdminLogin/>}/>
          <Route path='/super-admin-register' element={<SuperAdminRegister />} />
          <Route path='/admin-login' element={<AdminLogin />} />
          <Route path='/super-admin-create-register' element={<SuperAdminCreateRegister />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
