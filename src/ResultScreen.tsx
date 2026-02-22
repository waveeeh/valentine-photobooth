import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Download, RefreshCcw, ChevronLeft } from "lucide-react";
import { FilterType, StripStyle } from "./CameraScreen";
import { LayoutType } from "./LayoutSelectionScreen";

interface ResultScreenProps {
  images: string[];
  filter: FilterType;
  stripStyle: StripStyle;
  layoutCount: LayoutType;
  onRetake: () => void;
  onBack?: () => void;
}

export const ResultScreen = ({ 
  images, 
  filter, 
  stripStyle, 
  layoutCount,
  onRetake,
  onBack 
}: ResultScreenProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loadImages = async () => {
        const loadedImages = await Promise.all(
            images.map(src => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = src;
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                });
            })
        );
        return loadedImages;
    };

    loadImages().then(imgs => {
        if (imgs.length === 0) return;

        // Responsive sizing based on layout
        const photoWidth = window.innerWidth < 640 ? 300 : 400;
        const aspectRatio = imgs[0].height / imgs[0].width;
        const photoHeight = photoWidth * aspectRatio;
        
        const padding = window.innerWidth < 640 ? 16 : 24; 
        const bottomFooterHeight = window.innerWidth < 640 ? 100 : 140;
        
        const stripWidth = photoWidth + (padding * 2);
        const stripHeight = (padding * (layoutCount + 1)) + (photoHeight * layoutCount) + bottomFooterHeight;

        canvas.width = stripWidth;
        canvas.height = stripHeight;

        // Fill background based on style
        if (stripStyle === "black") {
            ctx.fillStyle = "#1a1a1a";
        } else if (stripStyle === "gray") {
            ctx.fillStyle = "#e5e7eb";
        } else {
            ctx.fillStyle = "#fdfdfd";
        }
        ctx.fillRect(0, 0, stripWidth, stripHeight);

        // Apply filter
        let filterString = "none";
        switch (filter) {
            case "grayscale": filterString = "grayscale(100%)"; break;
            case "sepia": filterString = "sepia(0.5) contrast(1.1)"; break;
            case "soft": filterString = "contrast(0.95) brightness(1.05) saturate(1.1)"; break;
            case "vintage": filterString = "sepia(0.3) contrast(1.1) brightness(0.9) hue-rotate(-5deg)"; break;
        }
        ctx.filter = filterString;

        // Draw each photo
        imgs.forEach((img, index) => {
            const y = padding + (index * (photoHeight + padding));
            ctx.drawImage(img, padding, y, photoWidth, photoHeight);
        });

        ctx.filter = "none";

        // Draw footer
        ctx.textAlign = "center";
        
        const textColor = stripStyle === "black" ? "#ffffff" : "#1a1a1a";
        const metaColor = stripStyle === "black" ? "#888888" : "#666666";
        
        const footerStartY = stripHeight - bottomFooterHeight + (window.innerWidth < 640 ? 20 : 30);
        
        // Message based on layout
        ctx.font = window.innerWidth < 640 ? "700 18px 'Courier New', monospace" : "700 24px 'Courier New', monospace";
        ctx.fillStyle = textColor;
        ctx.letterSpacing = "4px";
        ctx.fillText("Home Proj.", stripWidth / 2, footerStartY);
        
        // Date
        const date = new Date();
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        ctx.font = window.innerWidth < 640 ? "400 12px 'Courier New', monospace" : "400 16px 'Courier New', monospace";
        ctx.fillStyle = metaColor;
        ctx.letterSpacing = "2px";
        ctx.fillText(`${dateStr} • ${timeStr}`, stripWidth / 2, footerStartY + (window.innerWidth < 640 ? 20 : 30));

        // Watermark
        ctx.font = "400 10px 'Courier New', monospace";
        ctx.fillStyle = metaColor;
        ctx.globalAlpha = 0.5;
        ctx.fillText("© waveeeh", stripWidth - 60, stripHeight - 15);
        ctx.globalAlpha = 1;

        try {
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            setDownloadUrl(dataUrl);
        } catch (e) {
            console.error("Canvas export failed", e);
        }
    });

  }, [images, filter, stripStyle, layoutCount]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const link = document.createElement('a');
      link.href = downloadUrl || '';
      link.download = `photobooth-${new Date().toISOString().slice(0,10)}.jpg`;
      link.click();
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
        {onBack ? (
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={window.innerWidth < 640 ? 20 : 24} />
          </button>
        ) : <div className="w-10" />}
        
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 font-['Poppins']">
          Your Photostrip
        </h2>
        
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="flex flex-col items-center px-4 py-6">
          {/* Photo Strip Display */}
          <div className="relative shadow-2xl mb-6 transform transition-transform duration-300 hover:scale-[1.02]">
            {downloadUrl ? (
              <img 
                src={downloadUrl} 
                alt="Photostrip" 
                className="w-[260px] sm:w-[300px] md:w-[340px] lg:w-[380px] h-auto rounded-lg shadow-xl" 
              />
            ) : (
              <div className={`w-[260px] sm:w-[300px] md:w-[340px] h-[${layoutCount * 180}px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400 text-sm`}>
                Generating your strip...
              </div>
            )}
          </div>

          {/* Info Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-600">
              {layoutCount} Photos
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-600">
              Filter: {filter === "none" ? "Normal" : filter}
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-600">
              {stripStyle} Strip
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
        <div className="flex gap-3 justify-center items-center max-w-md mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onRetake}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <RefreshCcw size={16} />
            <span className=" xs:inline">Retake</span>
          </motion.button>
          
          {!downloadUrl ? (
            <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gray-400 text-white text-sm font-medium cursor-not-allowed">
              <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              <span className=" xs:inline">Processing</span>
            </button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors shadow-md disabled:opacity-50"
            >
              <Download size={16} />
              <span className=" xs:inline">{saving ? "Saving..." : "Download"}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};