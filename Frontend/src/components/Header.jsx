import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {

  const { user, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate();

  const onClickHandler = () => {
    if (user) {
      navigate('/result')

    } else {
      setShowLogin(true)
    }

  }

  return (
    <motion.div className='flex flex-col justify-center items-center my-20'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}

    >

      <motion.div className='text-blue-600 inline-flex items-center gap-2 bg-blue-50/50 px-6 py-2 rounded-full border border-blue-100 shadow-sm'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <p className='text-sm font-bold tracking-wide uppercase'>Best Text to Image Generator</p>
        <img src={assets.star_icon} alt="" className='w-4' />
      </motion.div>

      <motion.h1 className='text-5xl max-w-[300px] sm:text-7xl sm:max-w-[800px] mx-auto mt-10 text-center font-bold leading-tight'>
        Turn text to <span className='text-blue-600 relative inline-block group'>
          image
          <motion.span
            className='absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full'
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 1.5 }}
          />
        </span>, in seconds.
      </motion.h1>


      <motion.p className='text-center max-w-xl mx-auto mt-5 text-gray-600'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Unleash your creativity with AI. Turn your imagination into stunning visual art in seconds—just type, and watch the magic happen.</motion.p>


      <motion.button onClick={onClickHandler} className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-3 flex items-center gap-2 rounded-full hover:bg-gray-800 transition-colors shadow-lg'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ default: { duration: 0.5 }, opacity: { delay: 0.8, duration: 1 } }}


      >
        Generate Images
        <img className='h-6' src={assets.star_group} alt="" />
      </motion.button>



      <motion.div className='flex flex-wrap justify-center mt-16 gap-3'
        initial={{ opacity: 0, }}
        animate={{ opacity: 1, }}
        transition={{ delay: 1, duration: 1 }}


      >
        {Array(6).fill('').map((item, index) => (
          <motion.img
            whileHover={{ scale: 1.05, duration: 0.1 }}

            className='rounded hover:scale 105 tracking-all duration-300 cursor-pointer max-sm:w-10 '
            src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1} alt=""
            key={index} width={70} />
        ))}
      </motion.div>

      <motion.p className='mt-2 text-neutral-600'
        initial={{ opacity: 0, }}
        animate={{ opacity: 1, }}
        transition={{ delay: 1.2, duration: 0.8 }}

      >Generated images from imagify</motion.p>



    </motion.div>
  )
}

export default Header