import React, { useContext, useState } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';


const BuyCredit = () => {

  const { user, backendUrl, loadCreditsData, token, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initPay = async (order) => {
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
          // Verify payment
          const { data } = await axiosClient.post('/api/payment/verify-payment', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          }
          );

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
      }
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

      // Create order
      const { data } = await axiosClient.post('/api/payment/create-order', {
        amount: plan.price,
        credits: plan.credits
      }
      );

      if (data.success) {
        initPay(data);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      // toast handled by axiosClient
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className='min-h-[80vh] text-center pt-14 mb-10'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}

    >
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6
      sm:mb-10 '>Choose the plan that suits you best</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item, index) => (
          <div key={index} className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
            <img width={40} src={assets.logo_icon} alt="" />
            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'> <span className='text-3xl font-medium'>₹{item.price}</span> /  {item.credits} credits</p>

            <button
              onClick={() => paymentRazorpay(item.id)}
              disabled={loading}
              className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {loading ? 'Processing...' : user ? 'Purchase' : 'Get Started'}
            </button>

          </div>
        ))}
      </div>




    </motion.div>
  )
}

export default BuyCredit
