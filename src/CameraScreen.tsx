import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { LayoutType } from "./LayoutSelectionScreen";

export type FilterType = "none" | "grayscale" | "sepia" | "soft" | "vintage";
export type StripStyle = "white" | "black" | "gray";

interface CameraScreenProps {
  onBack: () => void;
  onCapture: (images: string[], filter: FilterType, stripStyle: StripStyle) => void;
  layoutCount: LayoutType;
}

// Responsive video constraints based on screen size
const getVideoConstraints = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  if (width < 640) { // mobile
    return { width: 480, height: 640, facingMode: "user" };
  } else if (width < 1024) { // tablet
    return { width: 600, height: 800, facingMode: "user" };
  } else { // desktop
    return { width: 720, height: 960, facingMode: "user" };
  }
};

export const CameraScreen = ({ onBack, onCapture, layoutCount }: CameraScreenProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [filter, setFilter] = useState<FilterType>("none");
  const [stripStyle, setStripStyle] = useState<StripStyle>("white");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [photosTaken, setPhotosTaken] = useState<number>(0);
  const [videoConstraints, setVideoConstraints] = useState(getVideoConstraints());
  const capturedImages = useRef<string[]>([]);

  // Update video constraints on window resize
  useEffect(() => {
    const handleResize = () => {
      setVideoConstraints(getVideoConstraints());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startCaptureSequence = useCallback(async () => {
    setCapturing(true);
    capturedImages.current = [];
    setPhotosTaken(0);

    for (let i = 1; i <= layoutCount; i++) {
        // Countdown
        for (let count = 3; count > 0; count--) {
            setCountdown(count);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        setCountdown(0); // "Smile!" moment
        
        // Capture
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            capturedImages.current.push(imageSrc);
            setPhotosTaken(i);
        }

        // Brief pause between shots
        if (i < layoutCount) {
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            setCountdown(null);
             await new Promise(resolve => setTimeout(resolve, 500)); 
        }
    }

    setCountdown(null);
    setCapturing(false);
    
    // Slight delay before finishing
    setTimeout(() => {
        onCapture(capturedImages.current, filter, stripStyle);
    }, 500);

  }, [webcamRef, onCapture, filter, stripStyle, layoutCount]);

  const getFilterStyle = (f: FilterType) => {
    switch (f) {
      case "grayscale": return "grayscale(100%)";
      case "sepia": return "sepia(0.6) contrast(1.2)";
      case "soft": return "contrast(0.9) brightness(1.1) saturate(1.2)";
      case "vintage": return "sepia(0.4) contrast(1.1) brightness(0.9) hue-rotate(-10deg)";
      default: return "none";
    }
  };

  // Get strip style border color for preview
  const getStripBorderColor = (style: StripStyle) => {
    switch (style) {
      case "white": return "border-white";
      case "black": return "border-black";
      case "gray": return "border-gray-400";
      default: return "border-white";
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-7xl mx-auto px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 relative z-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
        <button 
          onClick={onBack}
          disabled={capturing}
          className={`p-1.5 sm:p-2 rounded-full bg-white/80 text-gray-700 shadow-sm hover:bg-white transition-colors ${capturing ? 'opacity-0' : 'opacity-100'}`}
          aria-label="Go back"
        >
          <ChevronLeft size={window.innerWidth < 640 ? 20 : 24} />
        </button>
        <div className="text-xs sm:text-sm text-gray-500 font-medium tracking-widest uppercase">
             {capturing ? `${photosTaken}/${layoutCount}` : "Photo Booth"}
        </div>
        <div className="w-6 sm:w-8 md:w-10"></div> 
      </div>

      {/* Camera Viewfinder with Strip Style Preview */}
      <div className={`flex-1 relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 shadow-xl isolate border-4 sm:border-6 md:border-8 ${getStripBorderColor(stripStyle)}`}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: getFilterStyle(filter) }}
          mirrored={true}
        />
        
        {/* Flash Animation */}
        <AnimatePresence>
            {countdown === 0 && (
                <motion.div 
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-white z-30 pointer-events-none"
                />
            )}
        </AnimatePresence>

        {/* Countdown Overlay */}
        <AnimatePresence>
          {countdown !== null && countdown > 0 && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              key={countdown}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white drop-shadow-md">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layout Preview Indicator */}
        {!capturing && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 z-10">
            <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium shadow-md ${stripStyle === 'black' ? 'bg-white/90 text-black' : 'bg-black/50 text-white backdrop-blur-sm'}`}>
              {layoutCount} Photos • {stripStyle.charAt(0).toUpperCase() + stripStyle.slice(1)} Strip
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={`mt-3 sm:mt-4 flex flex-col gap-3 sm:gap-4 transition-opacity duration-300 ${capturing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Settings Container */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-6 items-center">
            
            {/* Strip Style Selector */}
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Strip Color</span>
              <div className="flex items-center gap-2 sm:gap-3 bg-white/50 backdrop-blur-sm p-1 sm:p-1.5 rounded-full border border-gray-200">
                  <button
                      onClick={() => setStripStyle("white")}
                      className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border border-gray-200 shadow-sm transition-transform ${stripStyle === "white" ? "scale-110 ring-2 ring-gray-400" : ""}`}
                      title="White Strip"
                      style={{ backgroundColor: "#ffffff" }}
                  />
                  <button
                      onClick={() => setStripStyle("gray")}
                      className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border border-gray-200 shadow-sm transition-transform ${stripStyle === "gray" ? "scale-110 ring-2 ring-gray-400" : ""}`}
                      title="Gray Strip"
                      style={{ backgroundColor: "#e5e7eb" }}
                  />
                  <button
                      onClick={() => setStripStyle("black")}
                      className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border border-gray-600 shadow-sm transition-transform ${stripStyle === "black" ? "scale-110 ring-2 ring-gray-400" : ""}`}
                      title="Black Strip"
                      style={{ backgroundColor: "#1a1a1a" }}
                  />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col items-center gap-1 sm:gap-2 w-full sm:w-auto">
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Filter</span>
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-2 px-1 scrollbar-hide justify-center w-full max-w-full">
                  {(["none", "grayscale", "sepia", "soft", "vintage"] as FilterType[]).map((f) => (
                      <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`flex-shrink-0 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap ${
                              filter === f 
                              ? "bg-gray-900 text-white shadow-md" 
                              : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                          }`}
                      >
                          {f === "none" ? "Normal" : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                  ))}
              </div>
            </div>
        </div>

        {/* Shutter Button */}
        <div className="flex items-center justify-center mt-1 sm:mt-2">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startCaptureSequence}
                disabled={capturing}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Take photos"
            >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-red-500 shadow-inner"></div>
            </motion.button>
        </div>
      </div>
    </div>
  );
};