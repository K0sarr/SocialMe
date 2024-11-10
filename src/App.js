import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './container/Home';
import Login from './components/Login';
import { fetchUser } from './utils/fetchUser';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();

    if (!user) navigate('/login');
  }, [navigate])
  

  return (
    <>
    <ToastContainer
    position="top-right"
    autoClose={4000}
    hideProgressBar={false}
    closeOnClick
    pauseOnHover
    draggable
    pauseOnFocusLoss
  />
    <Routes>
        <Route path="login" element={<Login />}/>
        <Route path="/*" element={<Home />}/>
    </Routes>
    </>
  )
}

export default App
