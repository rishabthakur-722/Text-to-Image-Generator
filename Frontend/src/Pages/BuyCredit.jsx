import React, { useContext, useState } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';


const BuyCredit = () => {

  const { user, loadCreditsData, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initPay = async (order) => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Purchase',
      description: 'Buy credits for image generation',
      order_id: order.orderId,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axiosClient.post('/api/payment/verify-payment', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });

          if (data.success) {
            loadCreditsData();
            toast.success('Credits added successfully!');
            navigate('/');
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.error(error);
          toast.error('Payment verification failed');
        }
      },
      theme: { color: "#2563eb" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true);
        return;
      }
      setLoading(true);
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        toast.error('Invalid plan selected');
        return;
      }
      const { data } = await axiosClient.post('/api/payment/create-order', {
        amount: plan.price,
        credits: plan.credits
      });

      if (data.success) {
        initPay(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className='min-h-[80vh] flex flex-col items-center py-20 px-4'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='border border-blue-100 bg-blue-50/50 text-blue-600 px-8 py-2 rounded-full font-bold text-sm mb-6'
      >
        OUR PRICING
      </motion.div>

      <h1 className='text-4xl sm:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600'>
        Choose the Perfect Plan
      </h1>
      <p className='text-lg text-gray-500 mb-16 text-center max-w-lg'>
        Unlock your creativity with flexible credit packs designed for every scale of creation.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl'>
        {plans.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -12, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
            className={`relative p-10 bg-white rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col ${item.id === 'Advanced' ? 'border-blue-500 shadow-2xl shadow-blue-500/10 scale-105 z-10' : 'border-gray-50 shadow-xl shadow-gray-200/50'}`}
          >
            {item.id === 'Advanced' && (
              <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-1 rounded-full text-xs font-bold tracking-widest uppercase'>
                Most Popular
              </div>
            )}

            <div className='w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6'>
              <img width={28} src={assets.logo_icon} alt="icon" />
            </div>

            <h3 className='text-2xl font-bold text-gray-800 mb-2'>{item.id}</h3>
            <p className='text-gray-500 text-sm mb-8'>{item.desc}</p>

            <div className='mb-10'>
              <span className='text-5xl font-extrabold text-gray-900'>₹{item.price}</span>
              <span className='text-gray-400 ml-2 font-medium'>/ {item.credits} credits</span>
            </div>

            <button
              onClick={() => paymentRazorpay(item.id)}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${item.id === 'Advanced' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:opacity-90' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} disabled:bg-gray-300 disabled:shadow-none`}
            >
              {loading ? (
                <div className='w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin' />
              ) : (
                user ? 'Select Plan' : 'Get Started'
              )}
            </button>

            <ul className='mt-10 space-y-4 text-sm text-gray-600'>
              <li className='flex items-center gap-2'>
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                {item.credits} Total Credits
              </li>
              <li className='flex items-center gap-2'>
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                High-Resolution Images
              </li>
              <li className='flex items-center gap-2'>
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Priority Support
              </li>
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit
