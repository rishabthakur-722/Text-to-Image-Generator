import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-6 py-12 mt-32 border-t border-gray-100'>

      <div className='flex flex-col items-center sm:items-start gap-3'>
        <img src={assets.logo} alt="Logo" width={150} className='hover:opacity-80 transition-opacity cursor-pointer' />
        <p className='text-sm text-gray-400 font-medium'>Creating the future of AI visuals.</p>
      </div>

      <p className='flex-1 text-center text-sm text-gray-500 font-medium'>
        Copyright © 2026 <span className='text-blue-600 font-bold'>Imagify</span> | All rights reserved.
      </p>

      <div className='flex gap-4'>
        {[assets.facebook_icon, assets.twitter_icon, assets.instagram_icon].map((icon, index) => (
          <div
            key={index}
            className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-blue-50 hover:scale-110 cursor-pointer transition-all duration-300 group'
          >
            <img src={icon} alt="social" width={20} className='group-hover:opacity-100 opacity-60 transition-opacity' />
          </div>
        ))}
      </div>

    </div>
  )
}

export default Footer