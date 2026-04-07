import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'


const GenerateBtn = () => {
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
    <motion.div className='pb-16 text-center'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h1 className='text-3xl md:text-5xl font-bold text-gray-900 mb-12 sm:mb-16'>
        Ready to see the magic?<br /> <span className='text-blue-600'>Start creating now</span>
      </h1>

      <motion.button
        onClick={onClickHandler}
        whileHover={{ scale: 1.05, shadow: "0 20px 25px -5px rgba(37, 99, 235, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        className='inline-flex items-center gap-2 px-14 py-4 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold text-xl shadow-2xl transition-all duration-300 group'
      >
        Generate Images
        <img src={assets.star_group} alt="" className='h-8 group-hover:rotate-12 transition-transform duration-300' />
      </motion.button>
    </motion.div>
  )
}

export default GenerateBtn