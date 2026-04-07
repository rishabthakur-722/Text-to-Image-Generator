import React, { useContext, useState } from 'react'
import { motion } from 'motion/react'
import { AppContext } from '../context/AppContext'
import axiosClient from '../api/axiosClient'
import { toast } from 'react-toastify'

const Login = () => {
  const { setToken, setShowLogin, loadCreditsData } = useContext(AppContext)
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      if (state === 'Login') {
        const { data } = await axiosClient.post('/api/user/login', { email, password })
        if (data.success) {
          setToken(data.token)
          localStorage.setItem('token', data.token)
          setShowLogin(false)
          loadCreditsData()
          toast.success('Logged in successfully')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axiosClient.post('/api/user/register', { name, email, password })
        if (data.success) {
          setToken(data.token)
          localStorage.setItem('token', data.token)
          setShowLogin(false)
          loadCreditsData()
          toast.success('Account created successfully')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div
      onClick={() => setShowLogin(false)}
      className='fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-md bg-black/40 flex justify-center items-center p-4'
    >
      <motion.form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className='bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4'
      >
        <h2 className='text-2xl font-bold text-gray-900 text-center mb-2'>
          {state === 'Login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {state === 'Register' && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className='border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors'
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className='border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors'
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className='border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors'
        />

        <button
          type="submit"
          className='bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95'
        >
          {state === 'Login' ? 'Login' : 'Create Account'}
        </button>

        <p className='text-sm text-gray-500 text-center'>
          {state === 'Login' ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setState(state === 'Login' ? 'Register' : 'Login')}
            className='text-blue-600 font-semibold cursor-pointer hover:underline'
          >
            {state === 'Login' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </motion.form>
    </div>
  )
}

export default Login