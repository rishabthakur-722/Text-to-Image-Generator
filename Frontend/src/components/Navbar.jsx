import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'motion/react'


const Navbar = () => {

  const { credit, user, logout, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'OCR', path: '/ocr' },
    { name: 'Gallery', path: '/result' },
    { name: 'Pricing', path: '/buy' },
  ];

  return (
    <div className='flex items-center justify-between py-6 font-medium relative'>
      <Link to='/' className='hover:opacity-80 transition-opacity'>
        <img src={assets.logo} alt="Logo" title="Home" className='w-28 sm:w-32' />
      </Link>

      <div className='flex items-center gap-4 sm:gap-8'>
        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-6 text-gray-600 font-semibold'>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:text-blue-600 transition-colors relative ${isActive(link.path) ? 'text-blue-600 after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {user ? (
          <div className='flex items-center gap-3 sm:gap-4'>
            <button
              onClick={() => navigate('/buy')}
              className='flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:shadow-md transition-all duration-300 group'
            >
              <img className='w-4 group-hover:rotate-12 transition-transform' src={assets.credit_star} alt="" />
              <p className='text-xs sm:text-sm font-bold text-blue-700'>Credits: {credit}</p>
            </button>
            <div className='h-8 w-[1px] bg-gray-200 hidden sm:block mx-1' />
            <div className='flex items-center gap-3'>
              <span className='text-sm font-semibold text-gray-700 hidden sm:block'>{user.name}</span>
              <button
                onClick={logout}
                className='text-sm font-bold text-gray-500 hover:text-red-500 transition-colors'
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-4 sm:gap-6'>
            <Link to='/ocr' className='hidden sm:block text-gray-600 hover:text-blue-600 transition-colors font-semibold'>OCR</Link>
            <button
              onClick={() => setShowLogin(true)}
              className='bg-black text-white px-8 py-2.5 sm:px-10 text-sm rounded-full font-bold hover:bg-gray-800 shadow-lg hover:shadow-black/20 transition-all active:scale-95'
            >
              Login
            </button>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setShowMobileMenu(true)}
          className='md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden'
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-white z-50 shadow-2xl md:hidden p-8 flex flex-col'
            >
              <div className='flex items-center justify-between mb-12'>
                <img src={assets.logo} alt="Logo" className='w-28' />
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className='p-2 text-gray-400 hover:text-gray-800 transition-colors'
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className='flex flex-col gap-6'>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={`text-2xl font-bold transition-colors ${isActive(link.path) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-800'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className='mt-auto pt-8 border-t border-gray-100'>
                <div className='flex items-center gap-4 text-gray-400'>
                  <p className='text-sm'>Powered by AI Creativity</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Navbar
