import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, ChevronLeft } from "lucide-react"; // Added ChevronLeft

export type LayoutType = 2 | 3 | 4;

interface LayoutSelectionScreenProps {
  onContinue: (layout: LayoutType) => void;
  onBack: () => void; // Added onBack prop
}

export const LayoutSelectionScreen = ({ onContinue, onBack }: LayoutSelectionScreenProps) => {
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(4);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 relative z-10">
      {/* Back Button - Added */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-2 rounded-full bg-white/80 text-gray-700 shadow-sm hover:bg-white transition-colors z-20"
        aria-label="Go back"
      >
        <ChevronLeft size={24} />
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Choose Your Layout
          </h1>
          <p className="text-gray-500">
            Select how many photos you'd like in your strip
          </p>
        </div>

        {/* Layout Options */}
        <div className="grid grid-cols-3 gap-6 mb-10 w-full">
          {/* 2 Strips */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedLayout(2)}
            className={`group relative flex flex-col items-center p-6 rounded-3xl transition-all ${
              selectedLayout === 2 
                ? "bg-gray-900 text-white shadow-2xl scale-105" 
                : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 shadow-lg"
            }`}
          >
            <div className="flex flex-col gap-2 mb-4">
              <div className={`w-16 h-10 rounded-lg ${selectedLayout === 2 ? "bg-white/20" : "bg-gray-200"} transition-colors`} />
              <div className={`w-16 h-10 rounded-lg ${selectedLayout === 2 ? "bg-white/20" : "bg-gray-200"} transition-colors`} />
            </div>
            <span className="text-base font-semibold">2 Photos</span>
            <span className={`text-xs mt-1 ${selectedLayout === 2 ? "text-white/70" : "text-gray-500"}`}>
              Classic duo
            </span>
            {selectedLayout === 2 && (
              <motion.div
                layoutId="selected"
                className="absolute -inset-1 border-4 border-pink-400 rounded-3xl"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </motion.button>

          {/* 3 Strips */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedLayout(3)}
            className={`group relative flex flex-col items-center p-6 rounded-3xl transition-all ${
              selectedLayout === 3 
                ? "bg-gray-900 text-white shadow-2xl scale-105" 
                : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 shadow-lg"
            }`}
          >
            <div className="flex flex-col gap-2 mb-4">
              <div className={`w-16 h-7 rounded-lg ${selectedLayout === 3 ? "bg-white/20" : "bg-gray-200"} transition-colors`} />
              <div className={`w-16 h-7 rounded-lg ${selectedLayout === 3 ? "bg-white/20" : "bg-gray-200"} transition-colors`} />
              <div className={`w-16 h-7 rounded-lg ${selectedLayout === 3 ? "bg-white/20" : "bg-gray-200"} transition-colors`} />
            </div>
            <span className="text-base font-semibold">3 Photos</span>
            <span className={`text-xs mt-1 ${selectedLayout === 3 ? "text-white/70" : "text-gray-500"}`}>
              Perfect trio
            </span>
            {selectedLayout === 3 && (
              <motion.div
                layoutId="selected"
                className="absolute -inset-1 border-4 border-pink-400 rounded-3xl"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </motion.button>

          {/* 4 Strips */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedLayout(4)}
            className={`group relative flex flex-col items-center p-6 rounded-3xl transition-all ${
              selectedLayout === 4 
                ? "bg-gray-900 text-white shadow-2xl scale-105" 
                : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 shadow-lg"
            }`}
          >
            <div className="flex flex-col gap-2 mb-4">
              <div className={`w-16 h-5 rounded-lg ${selectedLayout === 4 ? "bg-white/20" : "bg-gray-200"} transition-colors`} />
              <div className={`w-16 h-5 rounded-lg ${selectedLayout === 4 ? "bg-white/20" : "bg-gray-200"} transition-colors`} />
              <div className={`w-16 h-5 rounded-lg ${selectedLayout === 4 ? "bg-white/20" : "bg-gray-200"} transition-colors`} />
              <div className={`w-16 h-5 rounded-lg ${selectedLayout === 4 ? "bg-white/20" : "bg-gray-200"} transition-colors`} />
            </div>
            <span className="text-base font-semibold">4 Photos</span>
            <span className={`text-xs mt-1 ${selectedLayout === 4 ? "text-white/70" : "text-gray-500"}`}>
              Full classic
            </span>
            {selectedLayout === 4 && (
              <motion.div
                layoutId="selected"
                className="absolute -inset-1 border-4 border-pink-400 rounded-3xl"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </motion.button>
        </div>

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onContinue(selectedLayout)}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white font-semibold hover:bg-black transition-colors shadow-lg hover:shadow-xl"
        >
          Continue to Camera
          <ChevronRight size={20} />
        </motion.button>
      </motion.div>
    </div>
  );
};