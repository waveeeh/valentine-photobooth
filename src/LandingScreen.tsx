import { motion } from "motion/react";
import { Camera } from "lucide-react";

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen = ({ onStart }: LandingScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 md:px-8 py-6 relative z-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
      >
        {/* Camera Icon */}
        <motion.div 
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="mb-6 sm:mb-7 md:mb-8 relative p-4 sm:p-5 md:p-6 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Camera 
            size={window.innerWidth < 640 ? 36 : window.innerWidth < 768 ? 42 : 48} 
            className="text-gray-800" 
            strokeWidth={1.5} 
          />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 font-['Poppins'] tracking-tight text-center">
          Home Proj.<br/>Photo Booth
        </h1>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-8 sm:mb-10 md:mb-12 font-light tracking-wide text-center">
          Capture the moment.
        </p>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="px-8 sm:px-10 py-3 sm:py-4 bg-gray-900 text-white text-base sm:text-lg font-medium rounded-full shadow-xl hover:bg-black transition-all duration-300 w-full sm:w-auto min-w-[200px] sm:min-w-[240px] tracking-wide hover:shadow-2xl"
        >
          Start Photobooth
        </motion.button>
        
        {/* Decorative Dots */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex gap-2 sm:gap-3 justify-center opacity-30">
          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gray-400" />
          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gray-400" />
          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gray-400" />
        </div>
      </motion.div>
    </div>
  );
};