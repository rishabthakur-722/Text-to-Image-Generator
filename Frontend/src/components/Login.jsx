import React, { useContext, useState } from 'react'
import { motion } from 'motion/react'
import { SignIn, SignUp } from '@clerk/clerk-react'
import { AppContext } from '../context/AppContext'

const Login = () => {
  const { setShowLogin } = useContext(AppContext)
  const [state, setState] = useState('Login')

  return (
    <div
      onClick={() => setShowLogin(false)}
      className='fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-md bg-black/40 flex justify-center items-center p-4'
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className='relative bg-white p-4 rounded-2xl shadow-2xl'
      >
        <button
          type="button"
          onClick={() => setShowLogin(false)}
          className='absolute right-4 top-4 z-10 h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
        >
          x
        </button>
        {state === 'Login' ? (
          <SignIn routing="hash" />
        ) : (
          <SignUp routing="hash" />
        )}
        <div className='px-4 pb-4 text-center text-sm text-gray-500'>
          {state === 'Login' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setState(state === 'Login' ? 'Register' : 'Login')}
            className='font-semibold text-blue-600 hover:underline'
          >
            {state === 'Login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
