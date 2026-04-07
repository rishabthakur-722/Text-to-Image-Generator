import React, { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const ImageUpload = () => {
  const { token } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // ----------- Fetch History -----------
  const fetchHistory = useCallback(async () => {
    if (!token) return;
    setHistoryLoading(true);
    try {
      const { data } = await axiosClient.get("/api/ocr/history", {
        headers: { token },
      });
      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error("Fetch history error:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // ----------- FileReader Promise Function -----------
  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ----------- Handle Image Change -----------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ----------- Handle Extract Text -----------
  const handleExtractText = async () => {
    if (!selectedImage) return toast.error("Please select an image first");
    if (!token) return toast.error("Please login to use OCR");

    setLoading(true);
    setExtractedText("");

    try {
      const base64Image = await readFileAsBase64(selectedImage);

      const { data } = await axiosClient.post(
        "/api/ocr/extract-text",
        { imageBase64: base64Image },
        {
          headers: { token }, // ✅ Pass JWT token for auth
        }
      );

      if (data.success) {
        setExtractedText(data.text);
        toast.success("Text extracted successfully!");
        fetchHistory(); // Refresh history
      } else {
        toast.error(data.message || "Failed to extract text");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while extracting text");
    } finally {
      setLoading(false);
    }
  };

  // ----------- Handle Clear -----------
  const handleClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedText("");
  };

  return (
    <motion.div
      className="min-h-[80vh] flex flex-col items-center py-10 px-4"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl w-full border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Image to Text (OCR)
          </h2>
          <p className="text-gray-500 text-lg">
            Upload an image to extract text using AI-powered OCR
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Upload and Actions */}
          <div className="space-y-6">
            <div className="relative group">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 group"
              >
                {imagePreview ? (
                  <div className="relative w-full h-full p-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <p className="text-white font-medium">Change Image</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-700">Click to upload image</p>
                    <p className="text-sm text-gray-400 mt-2">Maximum file size: 5MB</p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleExtractText}
                disabled={!selectedImage || loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none transition-all duration-300 transform active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Extracting...
                  </div>
                ) : (
                  "Extract Text"
                )}
              </button>
              <button
                onClick={handleClear}
                disabled={!selectedImage}
                className="px-8 bg-gray-100 text-gray-600 py-4 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 transition-all duration-300"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Column: Results and History */}
          <div className="flex flex-col h-full space-y-6">
            {/* Extracted Text Area */}
            <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-gray-100 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Results</h3>
                {extractedText && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(extractedText);
                      toast.success("Copied to clipboard!");
                    }}
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    Copy All
                  </button>
                )}
              </div>

              <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 overflow-y-auto min-h-[200px]">
                {extractedText ? (
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {extractedText}
                  </p>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No text extracted yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent History Preview */}
            <div className="h-48 border-t border-gray-100 pt-6">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Recent Extractions
              </h4>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <AnimatePresence>
                  {history.length > 0 ? (
                    history.slice(0, 5).map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-shrink-0 w-32 h-32 rounded-lg border border-gray-100 overflow-hidden cursor-pointer hover:border-blue-300 transition-colors"
                        onClick={() => setExtractedText(item.prompt.replace('OCR: ', ''))}
                      >
                        <img src={item.imageUrl} alt="History" className="w-full h-full object-cover" />
                      </motion.div>
                    ))
                  ) : (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-32 h-32 bg-gray-50 rounded-lg animate-pulse" />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageUpload;
