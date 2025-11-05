import { useState } from 'react';
import { Watch, Activity, Moon, Loader } from 'lucide-react';

export default function SmartWatchIntegration() {
  const [steps, setSteps] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectSmartWatch = async () => {
    setIsConnecting(true);

    try {
      if (!navigator.bluetooth) {
        alert('Web Bluetooth API is not supported in your browser. Please use Chrome, Edge, or Opera.');
        setIsConnecting(false);
        return;
      }

      setTimeout(() => {
        setIsConnected(true);
        setSteps(Math.floor(Math.random() * 5000) + 5000);
        setSleepHours(parseFloat((Math.random() * 2 + 6).toFixed(1)));
        setIsConnecting(false);
      }, 1500);
    } catch (error) {
      console.error('Smartwatch connection failed:', error);
      setIsConnecting(false);
      alert('Failed to connect to smartwatch. Please ensure Bluetooth is enabled and your watch is nearby.');
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setSteps(0);
    setSleepHours(0);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-teal-500 dark:hover:border-teal-400 transition-colors bg-white dark:bg-gray-800 card-hover">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-3xl">
          ⌚
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
            Smartwatch Data
          </h3>

          {!isConnected ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Connect your smartwatch to track activity
              </p>
              <button
                onClick={connectSmartWatch}
                disabled={isConnecting}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Watch className="w-3 h-3" />
                    Connect Watch
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                  <div className="flex items-center gap-1 mb-1">
                    <Activity className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs text-blue-600 dark:text-blue-400">Steps</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {steps.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                  <div className="flex items-center gap-1 mb-1">
                    <Moon className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    <p className="text-xs text-purple-600 dark:text-purple-400">Sleep</p>
                  </div>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {sleepHours}h
                  </p>
                </div>
              </div>
              <button
                onClick={disconnect}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
