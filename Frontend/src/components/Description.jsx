import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"

const Description = () => {
  return (
    <motion.div
      className='flex flex-col items-center justify-center my-32 px-6 overflow-hidden'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className='text-center mb-16'>
        <h1 className='text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600'>
          Unlock AI Creativity
        </h1>
        <p className='text-xl text-gray-500'>Turn your imagination into stunning visuals in seconds.</p>
      </div>

      <div className='flex flex-col lg:flex-row items-center gap-16 max-w-6xl w-full'>
        <motion.div
          className='w-full lg:w-1/2 relative group'
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
        >
          <div className='absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
          <img
            src={assets.sample_img_1}
            alt="AI Sample"
            className='relative w-full rounded-2xl shadow-2xl border-4 border-white object-cover transform perspective-1000 group-hover:rotate-1 transition-transform duration-700'
          />
        </motion.div>

        <div className='w-full lg:w-1/2 space-y-8'>
          <div className='space-y-4'>
            <h2 className='text-3xl font-bold text-gray-800 leading-tight'>
              The Future of Visual Content is Here
            </h2>
            <div className='h-1.5 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full' />
          </div>

          <div className='space-y-6 text-lg'>
            <p className='text-gray-600 leading-relaxed font-medium'>
              Introducing our cutting-edge AI-powered generator that leverages deep learning to bridge the gap between thought and image.
            </p>
            <p className='text-gray-500 leading-relaxed'>
              Whether you're a professional designer looking for inspiration or an enthusiast bringing a concept to life, our platform provides the tools to create high-definition, unique visual art that captures your vision.
            </p>
          </div>

          <div className='flex flex-wrap gap-6 pt-4'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center'>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className='font-bold text-gray-700'>Instant Results</p>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center'>
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className='font-bold text-gray-700'>AI Powered Safe</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Description