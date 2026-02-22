import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useState } from "react";
import { LandingScreen } from "./LandingScreen";
import { CameraScreen, FilterType } from "./CameraScreen";
import { ResultScreen } from "./ResultScreen";
import { SupportScreen } from "./SupportScreen";
import { AnimatePresence, motion } from "motion/react";
import { LayoutSelectionScreen, LayoutType } from "./LayoutSelectionScreen";
type Screen = "landing" | "support" | "layout" | "camera" | "result";

interface CaptureData {
  images: string[];
  filter: FilterType;
  stripStyle: "white" | "black" | "gray";
  layout: LayoutType;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [captureData, setCaptureData] = useState<CaptureData | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(4);

  const handleStart = () => {
    setScreen("support");
  };

  const handleSupportContinue = () => {
    setScreen("layout");
  };

  const handleLayoutContinue = (layout: LayoutType) => {
    setSelectedLayout(layout);
    setScreen("camera");
  };

  const handleCapture = (images: string[], filter: FilterType, stripStyle: "white" | "black" | "gray") => {
    setCaptureData({ images, filter, stripStyle, layout: selectedLayout });
    setScreen("result");
  };

  const handleRetake = () => {
    setCaptureData(null);
    setScreen("camera");
  };

  const handleBackToLanding = () => {
      setScreen("landing");
  }

  const handleBackToLayout = () => {
    setScreen("layout");
  }

  function handleLayoutSelected(layout: number): void {
    throw new Error("Function not implemented.");
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

          {screen === "support" && (
            <motion.div 
              key="support"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex items-center justify-center"
            >
              <SupportScreen onContinue={handleSupportContinue} />
            </motion.div>
          )}

          {screen === "layout" && (
            <motion.div 
              key="layout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <LayoutSelectionScreen 
                onContinue={handleLayoutContinue}  // ✅ Use the correct function!
                onBack={() => setScreen("support")}
              />
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
               <CameraScreen 
                 onCapture={handleCapture} 
                 onBack={handleBackToLayout} 
                 layoutCount={selectedLayout}
               />
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
                  layoutCount={captureData.layout}
                  onRetake={handleRetake} 
                />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}