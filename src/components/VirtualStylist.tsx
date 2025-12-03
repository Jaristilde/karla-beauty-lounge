import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Heart, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

// =============================================================================
// HAIRSTYLE IMPORTS - Hair-only PNGs (transparent background)
// Each PNG should have ONLY the hair visible (face and background transparent)
// =============================================================================
import wednesdayBobHair from '../assets/images/wednesday-bob-hair.png';
import laceWigHair from '../assets/images/lace-wig-hair.png';
import flawlessBangHair from '../assets/images/Flawless-bang-hairstyle.png';
import laceWigSidepart from '../assets/images/LaceWigSidepart.png';

// =============================================================================
// TYPES
// =============================================================================
interface Hairstyle {
  id: string;
  name: string;
  thumbnail: string;
  overlayImage: string;
  // Per-style adjustments (optional) - tune these per hairstyle
  defaultOffsetY?: number;
  defaultScale?: number;
}

interface HeadGeometry {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotation: number; // radians
  foreheadY: number; // Y position of forehead for hair placement
}

// =============================================================================
// HAIRSTYLE CONFIGURATION
// Using the hair PNG as both thumbnail and overlay
// =============================================================================
const hairstyles: Hairstyle[] = [
  {
    id: 'wednesday-bob',
    name: 'Wednesday Bob',
    thumbnail: wednesdayBobHair,
    overlayImage: wednesdayBobHair,
    defaultOffsetY: -50,
    defaultScale: 1.0,
  },
  {
    id: 'lace-wig',
    name: 'Lace Wig Sew-In',
    thumbnail: laceWigHair,
    overlayImage: laceWigHair,
    defaultOffsetY: -50,
    defaultScale: 1.0,
  },
  {
    id: 'flawless-bang',
    name: 'Flawless Bang',
    thumbnail: flawlessBangHair,
    overlayImage: flawlessBangHair,
    defaultOffsetY: -50,
    defaultScale: 1.0,
  },
  {
    id: 'lace-wig-sidepart',
    name: 'Lace Wig Sidepart',
    thumbnail: laceWigSidepart,
    overlayImage: laceWigSidepart,
    defaultOffsetY: -50,
    defaultScale: 1.0,
  }
];

// =============================================================================
// LANDMARK INDICES (MediaPipe Face Landmarker - 468 points)
// =============================================================================
const LANDMARK = {
  LEFT_TEMPLE: 127,      // Left side of face near temple
  RIGHT_TEMPLE: 356,     // Right side of face near temple
  FOREHEAD_TOP: 10,      // Top center of forehead
  CHIN: 152,             // Bottom of chin
  LEFT_EYE_OUTER: 33,    // Left eye outer corner
  RIGHT_EYE_OUTER: 263,  // Right eye outer corner
  NOSE_TIP: 1,           // Tip of nose
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Calculate Euclidean distance between two points */
function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

/** Calculate midpoint between two points */
function midpoint(p1: { x: number; y: number }, p2: { x: number; y: number }): { x: number; y: number } {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

/** Calculate angle of line from p1 to p2 in radians */
function angleBetween(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/** Convert normalized landmark to pixel coordinates */
function landmarkToPixel(
  landmark: { x: number; y: number; z: number },
  width: number,
  height: number
): { x: number; y: number } {
  return {
    x: landmark.x * width,
    y: landmark.y * height,
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const VirtualStylist: React.FC = () => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const hairCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const hairImageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedHair, setSelectedHair] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [headGeometry, setHeadGeometry] = useState<HeadGeometry | null>(null);
  
  // Manual adjustment offsets (applied on top of landmark-based positioning)
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [extraScale, setExtraScale] = useState(1.0);

  // =============================================================================
  // INITIALIZE MEDIAPIPE FACE LANDMARKER
  // =============================================================================
  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      try {
        setIsModelLoading(true);
        
        // Load MediaPipe vision WASM files
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        // Create Face Landmarker
        const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'IMAGE', // We'll process single images (captured selfies)
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });

        faceLandmarkerRef.current = faceLandmarker;
        console.log('✅ MediaPipe Face Landmarker initialized');
        setIsModelLoading(false);
      } catch (err) {
        console.error('Failed to initialize Face Landmarker:', err);
        setError('Failed to load face detection. Please refresh and try again.');
        setIsModelLoading(false);
      }
    };

    initializeFaceLandmarker();

    return () => {
      // Cleanup
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, []);

  // =============================================================================
  // CAMERA CONTROLS
  // =============================================================================
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('Unable to access camera. Please allow camera permissions.');
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
    if (videoRef.current && captureCanvasRef.current) {
      const video = videoRef.current;
      const canvas = captureCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Mirror the image (selfie mode)
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
        
        // Detect face landmarks in captured image
        detectFaceLandmarks(canvas);
      }
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setSelectedHair(null);
    setHeadGeometry(null);
    setOffsetX(0);
    setOffsetY(0);
    setExtraScale(1.0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    startCamera();
  };

  // =============================================================================
  // FACE LANDMARK DETECTION
  // =============================================================================
  const detectFaceLandmarks = async (imageSource: HTMLCanvasElement | HTMLImageElement) => {
    if (!faceLandmarkerRef.current) {
      console.warn('Face Landmarker not initialized');
      return;
    }

    setIsDetecting(true);

    try {
      const results = faceLandmarkerRef.current.detect(imageSource);

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        const width = imageSource.width;
        const height = imageSource.height;

        // Extract key landmark points
        const leftTemple = landmarkToPixel(landmarks[LANDMARK.LEFT_TEMPLE], width, height);
        const rightTemple = landmarkToPixel(landmarks[LANDMARK.RIGHT_TEMPLE], width, height);
        const foreheadTop = landmarkToPixel(landmarks[LANDMARK.FOREHEAD_TOP], width, height);
        const chin = landmarkToPixel(landmarks[LANDMARK.CHIN], width, height);

        // Compute head geometry
        const headWidth = distance(leftTemple, rightTemple);
        const headCenter = midpoint(leftTemple, rightTemple);
        const headHeight = distance(headCenter, chin);
        const rotation = angleBetween(leftTemple, rightTemple);

        const geometry: HeadGeometry = {
          centerX: headCenter.x,
          centerY: headCenter.y,
          width: headWidth,
          height: headHeight,
          rotation: rotation,
          foreheadY: foreheadTop.y,
        };

        console.log('✅ Head geometry computed:', geometry);
        setHeadGeometry(geometry);
      } else {
        console.log('No face detected');
        // Set default geometry for manual positioning
        const width = imageSource.width;
        const height = imageSource.height;
        setHeadGeometry({
          centerX: width / 2,
          centerY: height / 3,
          width: width * 0.5,
          height: height * 0.4,
          rotation: 0,
          foreheadY: height * 0.15,
        });
      }
    } catch (err) {
      console.error('Face detection error:', err);
    } finally {
      setIsDetecting(false);
    }
  };

  // =============================================================================
  // DRAW HAIR OVERLAY
  // =============================================================================
  const drawHairOverlay = useCallback(() => {
    console.log('🎨 drawHairOverlay called', {
      hasCanvas: !!hairCanvasRef.current,
      hasHeadGeometry: !!headGeometry,
      selectedHair
    });

    if (!hairCanvasRef.current || !headGeometry || !selectedHair) {
      console.log('❌ Missing required refs/state');
      return;
    }

    const canvas = hairCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('❌ Could not get canvas context');
      return;
    }

    console.log('📐 Canvas dimensions:', canvas.width, 'x', canvas.height);

    // Get selected hairstyle
    const style = hairstyles.find(h => h.id === selectedHair);
    if (!style) {
      console.log('❌ Style not found for id:', selectedHair);
      return;
    }

    console.log('💇 Loading hair image:', style.overlayImage);

    // Load hair image if not loaded
    if (!hairImageRef.current || hairImageRef.current.src !== style.overlayImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('✅ Hair image loaded:', img.naturalWidth, 'x', img.naturalHeight);
        hairImageRef.current = img;
        drawHairOverlay(); // Redraw once loaded
      };
      img.onerror = (e) => {
        console.error('❌ Failed to load hair image:', e);
      };
      img.src = style.overlayImage;
      return;
    }

    const hairImg = hairImageRef.current;
    if (!hairImg.complete) {
      console.log('⏳ Hair image not complete yet');
      return;
    }

    console.log('🖼️ Hair image ready:', hairImg.naturalWidth, 'x', hairImg.naturalHeight);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // =============================================================================
    // COMPUTE HAIR TRANSFORM FROM LANDMARKS
    // =============================================================================

    // Base scale: hair width should be ~1.3x the detected head width
    const targetHairWidth = headGeometry.width * 1.3;
    const baseScale = targetHairWidth / hairImg.naturalWidth;

    // Apply extra scale from slider
    const finalScale = baseScale * extraScale * (style.defaultScale || 1.0);

    // Compute scaled dimensions
    const scaledWidth = hairImg.naturalWidth * finalScale;
    const scaledHeight = hairImg.naturalHeight * finalScale;

    // Position: center horizontally on head, vertically above forehead
    // The hair's bottom-center should align roughly with the forehead
    const baseX = headGeometry.centerX + offsetX;
    const baseY = headGeometry.foreheadY + (style.defaultOffsetY || -50) + offsetY;

    console.log('📍 Drawing hair at:', { baseX, baseY, scaledWidth, scaledHeight, finalScale });

    // =============================================================================
    // DRAW WITH TRANSFORMS
    // =============================================================================
    ctx.save();

    // Move origin to where we want to place the hair
    ctx.translate(baseX, baseY);

    // Rotate to match head angle
    ctx.rotate(headGeometry.rotation);

    // Draw hair image centered at origin
    ctx.drawImage(
      hairImg,
      -scaledWidth / 2,  // Center horizontally
      -scaledHeight * 0.3, // Position so hair "hangs" from top
      scaledWidth,
      scaledHeight
    );

    ctx.restore();
    console.log('✅ Hair drawn successfully');
  }, [headGeometry, selectedHair, offsetX, offsetY, extraScale]);

  // =============================================================================
  // SET CANVAS SIZE TO MATCH CONTAINER
  // =============================================================================
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current && hairCanvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        console.log('📐 Setting canvas size:', rect.width, 'x', rect.height);
        hairCanvasRef.current.width = rect.width;
        hairCanvasRef.current.height = rect.height;
      }
    };

    // Initial size set
    updateCanvasSize();

    // Update on resize
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Trigger redraw when canvas needs to show hair
  useEffect(() => {
    if (capturedImage && selectedHair && headGeometry && hairCanvasRef.current) {
      // Ensure canvas has correct size before drawing
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        hairCanvasRef.current.width = rect.width;
        hairCanvasRef.current.height = rect.height;
      }
      drawHairOverlay();
    }
  }, [capturedImage, selectedHair, headGeometry, drawHairOverlay]);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // =============================================================================
  // MANUAL ADJUSTMENT HANDLERS
  // =============================================================================
  const nudge = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 8;
    switch (direction) {
      case 'up': setOffsetY(prev => prev - step); break;
      case 'down': setOffsetY(prev => prev + step); break;
      case 'left': setOffsetX(prev => prev - step); break;
      case 'right': setOffsetX(prev => prev + step); break;
    }
  };

  const selectedStyle = hairstyles.find(h => h.id === selectedHair);

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <section className="py-20 bg-neutral-900 text-white" id="virtual-stylist">
      <div className="container mx-auto px-4 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            ✨ AI-Powered Virtual Try-On
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Virtual Fitting Room</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Take a selfie and our AI will automatically fit hairstyles to your face!
          </p>
        </div>

        <div className="flex flex-col items-center w-full max-w-md">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 text-red-200 p-4 rounded-xl mb-4 text-center text-sm border border-red-500/50">
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {isModelLoading && (
            <div className="bg-pink-500/20 text-pink-200 p-4 rounded-xl mb-4 text-center text-sm border border-pink-500/50 flex items-center gap-2 justify-center">
              <Loader2 className="animate-spin" size={16} />
              Loading AI face detection...
            </div>
          )}

          {/* =============================================================================
              MAIN STAGE - Camera/Selfie + Hair Overlay
          ============================================================================= */}
          <div
            ref={containerRef}
            className="relative w-full aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 ring-4 ring-neutral-900 mb-6"
          >
            {/* Live Camera Feed */}
            {!capturedImage && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
              />
            )}

            {/* Captured Selfie */}
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Selfie"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Hidden canvas for capturing video frame */}
            <canvas ref={captureCanvasRef} className="hidden" />

            {/* Hair Overlay Canvas - always mounted, shown when needed */}
            <canvas
              ref={hairCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                zIndex: 10,
                display: capturedImage && selectedHair ? 'block' : 'none'
              }}
            />

            {/* Face Detection Loading */}
            {isDetecting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <div className="text-center">
                  <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                  <p className="text-sm">Analyzing your face...</p>
                </div>
              </div>
            )}

            {/* Capture Button */}
            {!capturedImage && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button
                  onClick={captureImage}
                  disabled={isModelLoading}
                  className="w-16 h-16 rounded-full bg-white border-4 border-pink-500 flex items-center justify-center shadow-lg transform active:scale-95 transition hover:border-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="text-pink-500" size={32} />
                </button>
              </div>
            )}

            {/* Reset Button */}
            {capturedImage && (
              <button
                onClick={reset}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition z-20"
              >
                <RefreshCw size={20} />
              </button>
            )}

            {/* Manual Position Adjustment Buttons */}
            {capturedImage && selectedHair && headGeometry && (
              <div className="absolute top-4 left-4 flex flex-col items-center gap-1 z-20">
                <button
                  onClick={() => nudge('up')}
                  className="p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition"
                  title="Move hair up"
                >
                  <ChevronUp size={18} />
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => nudge('left')}
                    className="p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition"
                    title="Move hair left"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => nudge('right')}
                    className="p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition"
                    title="Move hair right"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
                <button
                  onClick={() => nudge('down')}
                  className="p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition"
                  title="Move hair down"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            )}
          </div>

          {/* =============================================================================
              CONTROLS
          ============================================================================= */}
          {capturedImage ? (
            <div className="w-full space-y-6">
              
              {/* Style Selection */}
              <div>
                <label className="text-sm text-neutral-400 mb-2 block px-1">Select a Style</label>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {hairstyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        setSelectedHair(style.id);
                        // Reset adjustments when changing style
                        setOffsetX(0);
                        setOffsetY(0);
                        setExtraScale(1.0);
                      }}
                      className={`flex-shrink-0 w-24 h-28 rounded-xl flex flex-col items-center justify-end overflow-hidden border-2 transition-all relative bg-neutral-700 ${
                        selectedHair === style.id
                          ? 'border-pink-500 ring-2 ring-pink-500/50'
                          : 'border-transparent hover:border-neutral-600'
                      }`}
                    >
                      <img
                        src={style.thumbnail}
                        alt={style.name}
                        className="absolute inset-0 w-full h-full object-contain p-1"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/90 to-transparent" />
                      <span className="relative z-10 text-xs font-medium pb-2 px-1 text-center leading-tight">
                        {style.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size/Scale Adjustment */}
              {selectedHair && (
                <div className="bg-neutral-800 p-4 rounded-xl space-y-4">
                  <div className="flex justify-between items-center text-xs text-neutral-400 uppercase tracking-wider">
                    <span>Fine-tune Fit</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Size</span>
                      <span>{Math.round(extraScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.8"
                      step="0.05"
                      value={extraScale}
                      onChange={(e) => setExtraScale(parseFloat(e.target.value))}
                      className="w-full h-2 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <p className="text-xs text-neutral-500 text-center">
                    💡 Use arrow buttons to adjust position, slider for size
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-pink-400 hover:to-pink-500 transition shadow-lg shadow-pink-900/30 text-white">
                <Heart size={20} />
                I Love This Style!
              </button>

              <p className="text-center text-sm text-neutral-500">
                Love what you see?{' '}
                <a href="#book" className="text-pink-400 hover:text-pink-300 underline">
                  Book an appointment
                </a>{' '}
                to get this look!
              </p>
            </div>
          ) : (
            <div className="mt-4 text-center px-6">
              <p className="text-sm text-neutral-400">
                📸 Take a selfie and our AI will fit styles to your face
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VirtualStylist;
