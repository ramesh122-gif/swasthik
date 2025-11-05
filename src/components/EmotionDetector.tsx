import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

interface Emotion {
  name: string;
  confidence: number;
}

export default function EmotionDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dominantEmotion, setDominantEmotion] = useState<Emotion | null>(null);
  const [allEmotions, setAllEmotions] = useState<Emotion[]>([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setIsLoading(true);
      const MODEL_URL = '/models';

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      setIsModelLoaded(true);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load face detection models');
      setIsLoading(false);
      console.error(err);
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError('');
      }
    } catch (err) {
      setError('Unable to access camera. Please grant camera permissions.');
      console.error(err);
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      setDominantEmotion(null);
      setAllEmotions([]);
    }
  };

  useEffect(() => {
    if (!isModelLoaded || !isCameraActive) return;

    const detectEmotions = async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections) {
          const expressions = detections.expressions;
          const emotionsArray: Emotion[] = Object.entries(expressions)
            .map(([name, confidence]) => ({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              confidence: Math.round(confidence * 100)
            }))
            .sort((a, b) => b.confidence - a.confidence);

          setDominantEmotion(emotionsArray[0]);
          setAllEmotions(emotionsArray);

          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
          };
          faceapi.matchDimensions(canvasRef.current, displaySize);

          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          }
        } else {
          setDominantEmotion(null);
          setAllEmotions([]);
        }
      }
    };

    const interval = setInterval(detectEmotions, 100);
    return () => clearInterval(interval);
  }, [isModelLoaded, isCameraActive]);

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: Record<string, string> = {
      Happy: '😊',
      Sad: '😢',
      Angry: '😠',
      Disgusted: '🤢',
      Surprised: '😮',
      Fearful: '😨',
      Neutral: '😐',
    };
    return emojiMap[emotion] || '🙂';
  };

  const getEmotionColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      Happy: 'text-green-600',
      Sad: 'text-blue-600',
      Angry: 'text-red-600',
      Disgusted: 'text-purple-600',
      Surprised: 'text-yellow-600',
      Fearful: 'text-orange-600',
      Neutral: 'text-gray-600',
    };
    return colorMap[emotion] || 'text-gray-600';
  };

  const getEmotionBgColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      Happy: 'bg-green-50 border-green-200',
      Sad: 'bg-blue-50 border-blue-200',
      Angry: 'bg-red-50 border-red-200',
      Disgusted: 'bg-purple-50 border-purple-200',
      Surprised: 'bg-yellow-50 border-yellow-200',
      Fearful: 'bg-orange-50 border-orange-200',
      Neutral: 'bg-gray-50 border-gray-200',
    };
    return colorMap[emotion] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading face detection models...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!isLoading && !error && !isCameraActive && (
        <button
          onClick={startVideo}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Start Camera
        </button>
      )}

      {isCameraActive && (
        <>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onLoadedMetadata={() => {
                if (canvasRef.current && videoRef.current) {
                  canvasRef.current.width = videoRef.current.videoWidth;
                  canvasRef.current.height = videoRef.current.videoHeight;
                }
              }}
              className="rounded-lg shadow-lg"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0"
            />
          </div>

          <button
            onClick={stopVideo}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Stop Camera
          </button>

          {dominantEmotion && (
            <div className={`${getEmotionBgColor(dominantEmotion.name)} border-2 rounded-xl p-6 w-full max-w-md`}>
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{getEmotionEmoji(dominantEmotion.name)}</div>
                <h3 className={`text-2xl font-bold ${getEmotionColor(dominantEmotion.name)}`}>
                  {dominantEmotion.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {dominantEmotion.confidence}% confidence
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">All Emotions:</p>
                {allEmotions.map((emotion) => (
                  <div key={emotion.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {getEmotionEmoji(emotion.name)} {emotion.name}
                    </span>
                    <div className="flex items-center gap-2 flex-1 ml-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getEmotionColor(emotion.name).replace('text-', 'bg-')}`}
                          style={{ width: `${emotion.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-10 text-right">
                        {emotion.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!dominantEmotion && isCameraActive && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 w-full max-w-md text-center">
              <p className="text-gray-600">No face detected. Please look at the camera.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
