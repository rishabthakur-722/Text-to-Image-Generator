import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Pages/Home';
import BuyCredit from './Pages/BuyCredit';
import Result from './Pages/Result';
import ImageUpload from './Pages/ImageUpload';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Login from './components/Login';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';


const App = () => {

  const { showLogin } = useContext(AppContext)

  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28  min-h-screen   bg-gradient-to-b from-teal-50 to-blue-100 '>

      <ToastContainer position='bottom-right' />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<BuyCredit />} />
        <Route path="/result" element={<Result />} />
        <Route path="/ocr" element={<ImageUpload />} />
      </Routes>

      <Footer />



    </div>
  )
}

export default App;