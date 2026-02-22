import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart, Github, Instagram, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./app/components/figma/ImageWithFallback";

interface SupportScreenProps {
  onContinue: () => void;
}

export const SupportScreen = ({ onContinue }: SupportScreenProps) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Progress bar
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / 30);
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [onContinue]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Support the Developer
          </h1>
          <p className="text-gray-500 text-sm">
            Thank you for using this photobooth! 💕
          </p>
        </motion.div>

        {/* QR Code Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 mb-8"
        >
          <div className="flex flex-col items-center">
            {/* QR Code */}
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-gradient-to-br from-pink-200/50 via-purple-200/50 to-orange-200/50 rounded-2xl blur-xl"></div>
              <div className="relative w-56 h-56 bg-white rounded-2xl p-3 border-2 border-gray-200 shadow-lg">
                <ImageWithFallback 
                  src="../assets/maya.jpg"
                  alt="Donation QR Code"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex items-center gap-2 mb-6">
              <Heart size={18} className="text-pink-500 fill-pink-500 animate-pulse" />
              <p className="text-sm text-gray-600 font-medium">
                Scan to support!
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 w-full">
              {/* GitHub - Verify this link */}
              <a 
                href="https://github.com/waveeeh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black transition-all hover:scale-105 shadow-md"
                title="GitHub"
              >
                <Github size={16} />
                GitHub
              </a>

              <a 
                href="https://instagram.com/waveeeh"  // Try without www.
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-medium hover:shadow-xl transition-all hover:scale-105 shadow-md"
                title="Instagram"
              >
                <Instagram size={16} />
                Instagram
              </a>

            </div>
        </div>
        </motion.div>

        {/* Timer & Skip Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Time Display & Skip */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              Auto-continuing in <span className="font-semibold text-gray-800">{timeLeft}s</span>
            </span>
            <button
              onClick={onContinue}
              className="text-sm text-gray-600 hover:text-gray-900 "
            >
              Skip
            </button>
          </div>

          {/* Continue Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white font-semibold hover:bg-black transition-colors shadow-lg hover:shadow-xl"
          >
            Continue to Layout
            <ChevronRight size={20} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
