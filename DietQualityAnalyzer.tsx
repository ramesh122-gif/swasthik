import { useState, useRef } from 'react';
import { Camera, X, Loader } from 'lucide-react';

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  rating: string;
  suggestions: string[];
}

export default function DietQualityAnalyzer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionalInfo | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please grant camera permissions.');
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
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        analyzeFood(imageData);
      }
    }
  };

  const analyzeFood = async (imageData: string) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const mockNutrition: NutritionalInfo = {
        calories: Math.floor(Math.random() * 400) + 300,
        protein: Math.floor(Math.random() * 30) + 10,
        carbs: Math.floor(Math.random() * 50) + 30,
        fats: Math.floor(Math.random() * 20) + 5,
        fiber: Math.floor(Math.random() * 10) + 2,
        rating: ['Excellent', 'Good', 'Fair', 'Needs Improvement'][Math.floor(Math.random() * 4)],
        suggestions: [
          'Add more leafy greens for vitamins',
          'Consider reducing portion size',
          'Great balance of macronutrients!',
          'Add a source of protein'
        ].slice(0, 2)
      };

      setNutritionInfo(mockNutrition);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleOpen = () => {
    setIsOpen(true);
    startCamera();
  };

  const handleClose = () => {
    setIsOpen(false);
    stopCamera();
    setCapturedImage(null);
    setNutritionInfo(null);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setNutritionInfo(null);
    startCamera();
  };

  if (!isOpen) {
    return (
      <div
        onClick={handleOpen}
        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-teal-500 dark:hover:border-teal-400 transition-colors cursor-pointer card-hover bg-white dark:bg-gray-800"
      >
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-3xl">
            🥗
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Diet Quality Analyzer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">AI-powered meal analysis</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Analyze your meal</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Diet Quality Analyzer</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!capturedImage ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <button
              onClick={captureImage}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Capture Meal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img src={capturedImage} alt="Captured meal" className="w-full h-auto" />
            </div>

            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing your meal...</span>
              </div>
            ) : nutritionInfo ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">
                    Nutritional Analysis
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Calories</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{nutritionInfo.calories}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Protein</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{nutritionInfo.protein}g</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Carbs</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{nutritionInfo.carbs}g</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Fats</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{nutritionInfo.fats}g</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Fiber</p>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{nutritionInfo.fiber}g</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">{nutritionInfo.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Suggestions</h3>
                  <ul className="space-y-1">
                    {nutritionInfo.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-blue-800 dark:text-blue-200">• {suggestion}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRetake}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Retake Photo
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 btn-primary"
                  >
                    Save Analysis
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
