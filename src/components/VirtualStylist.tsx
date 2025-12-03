import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scissors, RefreshCw, Move, Save } from 'lucide-react';

interface Hairstyle {
  id: string;
  name: string;
  color: string;
  svg: (color: string) => React.ReactNode;
}

const VirtualStylist: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [selectedHair, setSelectedHair] = useState<string | null>(null);
  const [hairPosition, setHairPosition] = useState({ x: 50, y: 50, scale: 1, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');

  // --- SVG HAIRSTYLE ASSETS (No external images needed) ---
  const hairstyles: Hairstyle[] = [
    {
      id: 'long-wavy',
      name: 'Long Wavy',
      color: '#4A3B2A',
      svg: (color) => (
        <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-xl" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }}>
          <path d="M100,20 C60,20 30,50 30,100 C30,160 20,200 10,250 C40,280 160,280 190,250 C180,200 170,160 170,100 C170,50 140,20 100,20 Z M100,40 C130,40 150,70 150,110 C150,120 50,120 50,110 C50,70 70,40 100,40 Z" fill={color} />
        </svg>
      )
    },
    {
      id: 'bob-cut',
      name: 'Chic Bob',
      color: '#1a1a1a',
      svg: (color) => (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }}>
          <path d="M100,20 C60,20 40,50 40,110 C40,150 50,170 60,180 C80,170 120,170 140,180 C150,170 160,150 160,110 C160,50 140,20 100,20 Z M100,45 C125,45 140,70 140,100 C140,105 60,105 60,100 C60,70 75,45 100,45 Z" fill={color} />
        </svg>
      )
    },
    {
      id: 'blonde-pixel',
      name: 'Pixie Cut',
      color: '#E6BE8A',
      svg: (color) => (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }}>
          <path d="M100,25 C70,25 50,45 50,90 C50,110 55,130 65,140 C60,120 65,110 60,110 C50,110 40,80 50,60 C60,30 90,10 120,15 C150,20 170,50 160,90 C155,110 145,130 135,140 C145,120 150,90 150,90 C150,45 130,25 100,25 Z" fill={color} />
        </svg>
      )
    }
  ];

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError("Unable to access camera. Please allow camera permissions.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setImage(canvas.toDataURL('image/png'));
        stopCamera();
      }
    }
  };

  const reset = () => {
    setImage(null);
    setSelectedHair(null);
    setHairPosition({ x: 50, y: 30, scale: 1, rotation: 0 });
    startCamera();
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!selectedHair) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !selectedHair) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    const sensitivity = 0.2; 
    setHairPosition(prev => ({
      ...prev,
      x: prev.x + (deltaX * sensitivity),
      y: prev.y + (deltaY * sensitivity)
    }));
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <section className="py-20 bg-neutral-900 text-white" id="virtual-stylist">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-pink-400">Virtual Fitting Room</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Not sure about a new look? Take a selfie and try on our styles instantly.
          </p>
        </div>

        <div className="flex flex-col items-center w-full max-w-md"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
        >
          {error && (
            <div className="bg-red-500/20 text-red-200 p-4 rounded-xl mb-4 text-center text-sm border border-red-500/50">
              {error}
            </div>
          )}

          <div className="relative w-full aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 ring-4 ring-neutral-900 mb-6">
            {!image && (
              <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" />
            )}
            {image && (
              <img src={image} alt="Selfie" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <canvas ref={canvasRef} className="hidden" />

            {image && selectedHair && (
              <div 
                className="absolute w-64 h-64 pointer-events-auto cursor-move"
                style={{
                  top: `${hairPosition.y}%`,
                  left: `${hairPosition.x}%`,
                  transform: `translate(-50%, -50%) scale(${hairPosition.scale}) rotate(${hairPosition.rotation}deg)`,
                  touchAction: 'none'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                {hairstyles.find(h => h.id === selectedHair)?.svg(
                  hairstyles.find(h => h.id === selectedHair)?.color || '#000'
                )}
                <div className="absolute inset-0 border-2 border-pink-400 rounded-lg opacity-0 hover:opacity-50 transition-opacity border-dashed flex items-center justify-center">
                    <Move className="text-pink-400 drop-shadow-md" size={32} />
                </div>
              </div>
            )}

            {!image && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button onClick={captureImage} className="w-16 h-16 rounded-full bg-white border-4 border-pink-500 flex items-center justify-center shadow-lg transform active:scale-95 transition">
                  <Camera className="text-pink-500" size={32} />
                </button>
              </div>
            )}
            
            {image && (
                <button onClick={reset} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition">
                    <RefreshCw size={20} />
                </button>
            )}
          </div>

          {image ? (
            <div className="w-full space-y-6">
              <div>
                <label className="text-sm text-neutral-400 mb-2 block px-1">Select a Style</label>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {hairstyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedHair(style.id)}
                      className={`flex-shrink-0 w-20 h-24 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${
                        selectedHair === style.id 
                          ? 'bg-pink-500/20 border-pink-500' 
                          : 'bg-neutral-800 border-transparent hover:bg-neutral-700'
                      }`}
                    >
                      <div className="w-10 h-10 overflow-hidden">
                          {style.svg(style.color)}
                      </div>
                      <span className="text-xs font-medium">{style.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedHair && (
                <div className="bg-neutral-800 p-4 rounded-xl space-y-4">
                  <div className="flex justify-between items-center text-xs text-neutral-400 uppercase tracking-wider">
                    <span>Adjust Fit</span>
                    <Scissors size={14} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Size</span>
                        <span>{Math.round(hairPosition.scale * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="2.0" step="0.05"
                      value={hairPosition.scale}
                      onChange={(e) => setHairPosition(prev => ({...prev, scale: parseFloat(e.target.value)}))}
                      className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Rotation</span>
                        <span>{hairPosition.rotation}°</span>
                    </div>
                    <input 
                      type="range" min="-45" max="45" 
                      value={hairPosition.rotation}
                      onChange={(e) => setHairPosition(prev => ({...prev, rotation: parseInt(e.target.value)}))}
                      className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                </div>
              )}
              
              <button className="w-full py-4 bg-pink-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-500 transition shadow-lg shadow-pink-900/20 text-white">
                <Save size={20} />
                Book This Look
              </button>
            </div>
          ) : (
            <div className="mt-4 text-center px-6">
              <p className="text-sm text-neutral-400">
                Allow camera access to begin.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VirtualStylist;