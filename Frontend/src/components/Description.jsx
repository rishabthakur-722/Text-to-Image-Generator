import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"

const Description = () => {
  return (

    <motion.div className='flex  flex-col items-center justify-center my-24 p-6 md:px-28'
    initial={{opacity:0.2, y:100}}
    transition={{duration: 1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}    
    >
      <h1 className='text-3xl sm:text-4xl font-semibold mb-3'>Create AI Images</h1>
      <p className='text-grey-500 mb-10'>Turn your imagination into stunning visuals.</p>



      <div className='flex flex-col md:gap-14 md:flex-row gap-10 items-center'>

        <img src={assets.sample_img_1} alt="" className='w-80 xl:w-96 rounded-lg'/>

        <div>

          <h2 className='text-2xl font-semibold mb-4'>Introducing the AI-Powered Text to Image Generator</h2>

          <p className='text-gray-600 mb-4'>
           Our AI-powered text-to-image generator leverages advanced machine learning models to turn simple text into stunning, high-resolution images.Bring your ideas to life effortlessly and explore endless creative possibilities with just a few words.
          </p>

          <p className='text-gray-600'>
            Whether you're a designer, marketer, or just someone looking to visualize concepts, our tool makes it easy to create unique images that capture your vision. Simply input your text description, and watch as our AI transforms it into a beautiful image in seconds.
          </p>

        </div>
      </div>

    </motion.div>
  )
}

export default Description