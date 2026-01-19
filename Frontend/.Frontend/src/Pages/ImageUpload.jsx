import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { motion } from "motion/react";
import { toast } from 'react-toastify';
import axios from 'axios';

const ImageUpload = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractText = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    if (!token) {
      toast.error('Please login to use OCR');
      return;
    }

    setLoading(true);
    setExtractedText('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        const { data } = await axios.post(
          backendUrl + '/api/ocr/extract-text',
          { imageBase64: base64Image },
          { headers: { token } }
        );

        if (data.success) {
          setExtractedText(data.text);
          toast.success('Text extracted successfully!');
        } else {
          toast.error(data.message || 'Failed to extract text');
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error(error);
      toast.error('Error extracting text from image');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedText('');
  };

  return (
    <motion.div
      className='min-h-[80vh] flex flex-col items-center justify-center py-10'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className='bg-white rounded-2xl p-8 shadow-lg max-w-2xl w-full'>
        <h2 className='text-3xl font-semibold text-center mb-6 text-gray-800'>
          Image to Text (OCR)
        </h2>
        <p className='text-center text-gray-600 mb-8'>
          Upload an image to extract text using AI-powered OCR
        </p>

        {/* Upload Area */}
        <div className='mb-6'>
          <label
            htmlFor='image-upload'
            className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-gray-100'
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt='Preview'
                className='max-h-60 max-w-full object-contain rounded-lg'
              />
            ) : (
              <div className='flex flex-col items-center'>
                <svg
                  className='w-16 h-16 text-gray-400 mb-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
                <p className='text-gray-600 font-medium'>Click to upload image</p>
                <p className='text-sm text-gray-500 mt-1'>PNG, JPG up to 5MB</p>
              </div>
            )}
            <input
              id='image-upload'
              type='file'
              className='hidden'
              accept='image/*'
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 mb-6'>
          <button
            onClick={handleExtractText}
            disabled={!selectedImage || loading}
            className='flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300'
          >
            {loading ? 'Extracting...' : 'Extract Text'}
          </button>
          <button
            onClick={handleClear}
            disabled={!selectedImage}
            className='px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-300'
          >
            Clear
          </button>
        </div>

        {/* Extracted Text Display */}
        {extractedText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-gray-50 rounded-lg p-6 border border-gray-200'
          >
            <h3 className='text-lg font-semibold mb-3 text-gray-800'>Extracted Text:</h3>
            <div className='bg-white p-4 rounded border border-gray-200 max-h-64 overflow-y-auto'>
              <p className='text-gray-700 whitespace-pre-wrap'>{extractedText}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(extractedText);
                toast.success('Text copied to clipboard!');
              }}
              className='mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300'
            >
              Copy to Clipboard
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageUpload;
