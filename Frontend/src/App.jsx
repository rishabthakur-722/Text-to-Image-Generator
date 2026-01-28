import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Pages/Home';
import BuyCredit from './Pages/BuyCredit';
import Result from './Pages/Result';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import { AppContext } from './context/AppContext';

import ImageUpload from './Pages/ImageUpload';

function App() {
  const { showLogin } = useContext(AppContext);

  return (
    <div className='min-h-screen bg-slate-50 px-4 sm:px-[5%] md:px-[10%] lg:px-[15%]'>
      <ToastContainer position="bottom-right" />
      <Navbar />
      {showLogin && <Login />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/buy' element={<BuyCredit />} />
        <Route path='/result' element={<Result />} />
        <Route path='/ocr' element={<ImageUpload />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;