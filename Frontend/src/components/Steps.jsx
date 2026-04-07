import { stepsData } from '../assets/assets'
import { motion } from "motion/react"

const Steps = () => {
  return (
    <motion.div
      className='flex flex-col items-center justify-center my-32 px-4'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className='text-center mb-16'>
        <h1 className='text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600'>
          How it works
        </h1>
        <p className='text-xl text-gray-500 max-w-lg mx-auto'>
          Three simple steps to turn your creative thoughts into visual reality.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl'>
        {stepsData.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10 }}
            className='relative group flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-blue-200 transition-all duration-500'
          >
            {/* Step Number Badge */}
            <div className='absolute top-6 left-6 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500'>
              {index + 1}
            </div>

            <div className='mb-8 p-6 bg-blue-50 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500'>
              <img src={item.icon} alt={item.title} className='w-16 h-16 object-contain' />
            </div>

            <div className='space-y-4'>
              <h2 className='text-2xl font-bold text-gray-800'>
                {item.title}
              </h2>
              <p className='text-gray-500 leading-relaxed'>
                {item.description}
              </p>
            </div>

            {/* Subtle Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none' />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default Steps
