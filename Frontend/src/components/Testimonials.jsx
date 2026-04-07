import { assets, testimonialsData } from '../assets/assets'
import { motion } from "motion/react"

const Testimonials = () => {
  return (
    <motion.div className='flex flex-col items-center justify-center my-32 py-12 px-6'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className='text-center mb-16'>
        <h1 className='text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600'>
          Client Testimonials
        </h1>
        <p className='text-xl text-gray-500 max-w-lg mx-auto'>
          Join thousands of creators who are already using our platform to bring their ideas to life.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl'>
        {testimonialsData.map((testimonial, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -8 }}
            className='bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center text-center transition-all duration-500'
          >
            <div className='relative mb-6'>
              <div className='absolute -inset-2 bg-blue-100 rounded-full blur-md opacity-50' />
              <img src={testimonial.image} alt={testimonial.name} className='relative rounded-full w-20 h-20 object-cover border-4 border-white shadow-sm' />
            </div>

            <div className='space-y-1 mb-4'>
              <h2 className='text-xl font-bold text-gray-800'>{testimonial.name}</h2>
              <p className='text-blue-600 text-sm font-semibold'>{testimonial.role}</p>
            </div>

            <div className='flex gap-1 mb-6 bg-blue-50/50 px-4 py-2 rounded-full'>
              {Array(5).fill(0).map((_, i) => (
                <img
                  key={i}
                  src={assets.rating_star}
                  className={`w-4 ${i < testimonial.stars ? 'opacity-100' : 'opacity-20'}`}
                  alt="star"
                />
              ))}
            </div>

            <p className='text-gray-600 leading-relaxed italic'>
              "{testimonial.text}"
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default Testimonials
