import React, { useContext, useState, useEffect, useCallback } from 'react'
import { assets } from '../assets/assets'
import { motion, AnimatePresence } from "motion/react"
import { AppContext } from '../context/AppContext'
import axiosClient from '../api/axiosClient'
import { toast } from 'react-toastify'

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);

  const { generateImage, token } = useContext(AppContext)

  const fetchHistory = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axiosClient.get('/api/image/history', {
        headers: { token }
      });
      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error("Fetch history error:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input) {
      const resultImage = await generateImage(input)

      if (resultImage) {
        setIsImageLoading(true)
        setImage(resultImage)
        fetchHistory(); // Refresh history
      }
    }
    setLoading(false);
  }

  return (
    <motion.div className='flex flex-col min-h-[90vh] items-center py-10 px-4'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-full max-w-2xl'>
        <div className='relative mb-8 group'>
          <div className='relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white'>
            <img
              src={image}
              alt=""
              className={`max-w-full sm:max-w-md transition-all duration-500 ${loading ? 'opacity-50 scale-105' : 'opacity-100 scale-100'}`}
            />
            {loading && (
              <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm'>
                <div className='w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4' />
                <p className='text-white font-medium animate-pulse'>Generating Magic...</p>
              </div>
            )}
          </div>
          <span className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-[10s] ${loading ? 'w-full' : 'w-0'}`} />
        </div>

        {!isImageLoading ? (
          <div className='flex w-full bg-white shadow-xl text-gray-800 p-1 rounded-2xl border border-gray-100 mb-12'>
            <input
              onChange={e => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder='Describe what you want to generate...'
              className='flex-1 bg-transparent outline-none px-6 py-4 text-lg placeholder:text-gray-400'
            />
            <button
              type='submit'
              disabled={loading || !input}
              className='bg-black text-white px-8 sm:px-12 py-4 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-300 transition-all active:scale-95'
            >
              Generate
            </button>
          </div>
        ) : (
          <div className='flex gap-4 flex-wrap justify-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <button
              type="button"
              onClick={() => { setIsImageLoading(false); setInput(''); }}
              className='bg-white border-2 border-black text-black px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all'
            >
              Generate Another
            </button>
            <a
              href={image}
              download="generated-image.png"
              className='bg-black text-white px-10 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2'
            >
              Download
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        )}
      </form>

      {/* History Section */}
      <div className='w-full max-w-4xl mt-12 border-t border-gray-100 pt-12 text-center'>
        <h3 className='text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600'>
          Your Recent Masterpieces
        </h3>

        {history.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            <AnimatePresence>
              {history.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className='group relative aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer border-2 border-transparent hover:border-blue-500/50 transition-all'
                  onClick={() => {
                    setImage(item.imageUrl);
                    setIsImageLoading(true);
                    setInput(item.prompt);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className='w-full h-full object-cover transition-transform group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4'>
                    <p className='text-white text-xs font-medium line-clamp-2 text-left'>
                      {item.prompt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className='py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200'>
            <p className='text-gray-400 font-medium italic'>Your gallery is waiting for its first creation...</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Result
