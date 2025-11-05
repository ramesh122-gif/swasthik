import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, CameraOff, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EmotionDetectorWidgetProps {
  onEmotionDetected?: (emotion: string, confidence: number, allEmotions: Record<string, number>) => void;
  autoLog?: boolean;
  autoStart?: boolean;
  analysisDuration?: number;
  context?: string;
  sessionId?: string;
  showControls?: boolean;
}

interface Emotion {
  name: string;
  confidence: number;
}

export default function EmotionDetectorWidget({
  onEmotionDetected,
  autoLog = false,
  autoStart = false,
  analysisDuration = 0,
  context = 'general',
  sessionId,
  showControls = true,
}: EmotionDetectorWidgetProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dominantEmotion, setDominantEmotion] = useState<Emotion | null>(null);
  const [allEmotions, setAllEmotions] = useState<Emotion[]>([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [lastLoggedTime, setLastLoggedTime] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(analysisDuration);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (autoStart && isModelLoaded && !isCameraActive) {
      startVideo();
    }
  }, [autoStart, isModelLoaded, isCameraActive]);

  useEffect(() => {
    if (analysisDuration > 0 && isCameraActive && !analysisComplete) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setAnalysisComplete(true);
            stopVideo();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [analysisDuration, isCameraActive, analysisComplete]);

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
        video: { width: 640, height: 480 },
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
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      setDominantEmotion(null);
      setAllEmotions([]);
    }
  };

  const logEmotionToDatabase = async (emotion: string, confidence: number, allEmotionsData: Record<string, number>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = Date.now();
      if (now - lastLoggedTime < 10000) return;

      await supabase.from('emotion_detections').insert({
        user_id: user.id,
        detected_emotion: emotion,
        confidence: confidence,
        all_emotions: allEmotionsData,
        context: context,
        session_id: sessionId,
      });

      setLastLoggedTime(now);

      const moodScore = calculateMoodScore(emotion, confidence);
      await supabase.from('mood_entries').insert({
        user_id: user.id,
        mood_score: moodScore,
        emotions: [emotion],
        entry_source: 'ai_detected',
        detection_confidence: confidence,
      });
    } catch (err) {
      console.error('Error logging emotion:', err);
    }
  };

  const calculateMoodScore = (emotion: string, confidence: number): number => {
    const emotionScores: Record<string, number> = {
      Happy: 9,
      Surprised: 7,
      Neutral: 6,
      Sad: 3,
      Angry: 2,
      Fearful: 2,
      Disgusted: 3,
    };

    const baseScore = emotionScores[emotion] || 6;
    const adjustedScore = Math.round(baseScore * (confidence / 100));
    return Math.max(1, Math.min(10, adjustedScore));
  };

  const saveCurrentEmotion = async () => {
    if (dominantEmotion) {
      const allEmotionsObj = allEmotions.reduce((acc, em) => {
        acc[em.name.toLowerCase()] = em.confidence;
        return acc;
      }, {} as Record<string, number>);

      await logEmotionToDatabase(
        dominantEmotion.name,
        dominantEmotion.confidence,
        allEmotionsObj
      );

      alert('Emotion saved successfully!');
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
              confidence: Math.round(confidence * 100),
            }))
            .sort((a, b) => b.confidence - a.confidence);

          setDominantEmotion(emotionsArray[0]);
          setAllEmotions(emotionsArray);

          if (onEmotionDetected) {
            const allEmotionsObj = emotionsArray.reduce((acc, em) => {
              acc[em.name.toLowerCase()] = em.confidence;
              return acc;
            }, {} as Record<string, number>);
            onEmotionDetected(emotionsArray[0].name, emotionsArray[0].confidence, allEmotionsObj);
          }

          if (autoLog && emotionsArray[0].confidence > 60) {
            const allEmotionsObj = emotionsArray.reduce((acc, em) => {
              acc[em.name.toLowerCase()] = em.confidence;
              return acc;
            }, {} as Record<string, number>);
            await logEmotionToDatabase(emotionsArray[0].name, emotionsArray[0].confidence, allEmotionsObj);
          }

          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
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

    const interval = setInterval(detectEmotions, 300);
    return () => clearInterval(interval);
  }, [isModelLoaded, isCameraActive, autoLog, context, sessionId]);

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
    <div className="flex flex-col items-center gap-4">
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading emotion detection...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && !isCameraActive && showControls && (
        <button
          onClick={startVideo}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          <Camera className="w-4 h-4" />
          Start Emotion Detection
        </button>
      )}

      {isCameraActive && (
        <>
          <div className="relative rounded-lg overflow-hidden">
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
              className="rounded-lg shadow-lg max-w-full"
              style={{ maxHeight: '300px' }}
            />
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
          </div>

          {showControls && (
            <div className="flex gap-2">
              <button
                onClick={stopVideo}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <CameraOff className="w-4 h-4" />
                Stop
              </button>
              {!autoLog && dominantEmotion && (
                <button
                  onClick={saveCurrentEmotion}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Mood
                </button>
              )}
            </div>
          )}

          {dominantEmotion && (
            <div className={`${getEmotionBgColor(dominantEmotion.name)} border-2 rounded-xl p-4 w-full`}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">{getEmotionEmoji(dominantEmotion.name)}</div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${getEmotionColor(dominantEmotion.name)}`}>
                    {dominantEmotion.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{dominantEmotion.confidence}% confidence</p>
                  {autoLog && <p className="text-xs text-gray-500 mt-1">Auto-logging to mood tracker</p>}
                </div>
              </div>
            </div>
          )}

          {!dominantEmotion && isCameraActive && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 w-full text-center">
              <p className="text-gray-600 text-sm">No face detected. Please look at the camera.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
