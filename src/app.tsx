import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useState } from "react";
import { LandingScreen } from "./LandingScreen";
import { CameraScreen, FilterType } from "./CameraScreen";
import { ResultScreen } from "./ResultScreen";
import { AnimatePresence, motion } from "motion/react";

type Screen = "landing" | "camera" | "result";

interface CaptureData {
  images: string[];
  filter: FilterType;
  stripStyle: "white" | "black" | "gray";
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [captureData, setCaptureData] = useState<CaptureData | null>(null);

  const handleStart = () => {
    setScreen("camera");
  };

  const handleCapture = (images: string[], filter: FilterType, stripStyle: "white" | "black" | "gray") => {
    setCaptureData({ images, filter, stripStyle });
    setScreen("result");
  };

  const handleRetake = () => {
    setCaptureData(null);
    setScreen("camera");
  };

  const handleBackToLanding = () => {
      setScreen("landing");
  }

  return (
    <div className="min-h-screen w-full bg-[#fcfcfc] text-gray-800 font-['Poppins'] overflow-hidden relative selection:bg-gray-200">
      
      {/* Minimal Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-gray-50 to-white"></div>

      {/* Content Container */}
      <main className="relative z-10 w-full h-screen flex flex-col overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {screen === "landing" && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex items-center justify-center"
            >
              <LandingScreen onStart={handleStart} />
            </motion.div>
          )}

          {screen === "camera" && (
             <motion.div 
                key="camera"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex flex-col items-center justify-center"
            >
               <CameraScreen onCapture={handleCapture} onBack={handleBackToLanding} />
             </motion.div>
          )}

          {screen === "result" && captureData && (
             <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
            >
               <ResultScreen 
                  images={captureData.images} 
                  filter={captureData.filter}
                  stripStyle={captureData.stripStyle}
                  onRetake={handleRetake} 
                />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="fixed bottom-2 right-2 text-xs text-gray-400 z-50">
        created with 💖 by waveeeh
      </footer>
    </div>
  );
}
