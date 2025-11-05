import { useState, useEffect, ReactNode } from 'react';
import { Lock, Fingerprint, KeyRound, ShieldCheck } from 'lucide-react';
import {
  isBiometricAvailable,
  isBiometricSetup,
  isPINSetup,
  authenticateWithBiometric,
  verifyPIN,
  setupBiometric,
  setupPIN,
} from '../lib/biometric';

interface BiometricGuardProps {
  children: ReactNode;
}

export default function BiometricGuard({ children }: BiometricGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasBiometric, setHasBiometric] = useState(false);
  const [biometricConfigured, setBiometricConfigured] = useState(false);
  const [pinConfigured, setPinConfigured] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [setupStep, setSetupStep] = useState<'choice' | 'biometric' | 'pin'>('choice');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState<'biometric' | 'pin'>('biometric');

  useEffect(() => {
    checkAuthSetup();
  }, []);

  const checkAuthSetup = async () => {
    try {
      const [bioAvailable, bioSetup, pinSetup] = await Promise.all([
        isBiometricAvailable(),
        isBiometricSetup(),
        isPINSetup(),
      ]);

      setHasBiometric(bioAvailable);
      setBiometricConfigured(bioSetup);
      setPinConfigured(pinSetup);

      if (!bioSetup && !pinSetup) {
        setShowSetup(true);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error checking auth setup:', err);
      setError('Failed to load authentication settings');
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setError('');
    const result = await authenticateWithBiometric();

    if (result.success) {
      setIsAuthenticated(true);
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  const handlePINAuth = async () => {
    if (pin.length < 4) {
      setError('Please enter your PIN');
      return;
    }

    setError('');
    const result = await verifyPIN(pin);

    if (result.success) {
      setIsAuthenticated(true);
      setPin('');
    } else {
      setError(result.error || 'Incorrect PIN');
      setPin('');
    }
  };

  const handleSetupBiometric = async () => {
    setError('');
    const result = await setupBiometric();

    if (result.success) {
      setBiometricConfigured(true);
      setShowSetup(false);
      setIsAuthenticated(true);
    } else {
      setError(result.error || 'Failed to setup biometric authentication');
    }
  };

  const handleSetupPIN = async () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setError('');
    const result = await setupPIN(pin);

    if (result.success) {
      setPinConfigured(true);
      setShowSetup(false);
      setIsAuthenticated(true);
      setPin('');
      setConfirmPin('');
    } else {
      setError(result.error || 'Failed to setup PIN');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading security...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <ShieldCheck className="w-16 h-16 text-teal-600 dark:text-teal-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Secure Your Journal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Choose how you want to protect your private journal entries
            </p>
          </div>

          {setupStep === 'choice' && (
            <div className="space-y-3">
              {hasBiometric && (
                <button
                  onClick={() => setSetupStep('biometric')}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
                >
                  <Fingerprint className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">Biometric Authentication</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Use fingerprint or face recognition</p>
                  </div>
                </button>
              )}

              <button
                onClick={() => setSetupStep('pin')}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
              >
                <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">PIN Code</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Create a secure 4-digit PIN</p>
                </div>
              </button>
            </div>
          )}

          {setupStep === 'biometric' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                Your device will prompt you to authenticate. Follow the on-screen instructions to register your biometric data.
              </p>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}
              <button
                onClick={handleSetupBiometric}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Setup Biometric
              </button>
              <button
                onClick={() => setSetupStep('choice')}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
              >
                Back to options
              </button>
            </div>
          )}

          {setupStep === 'pin' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Create PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-6 digit PIN"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Re-enter PIN"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                />
              </div>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}
              <button
                onClick={handleSetupPIN}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Setup PIN
              </button>
              <button
                onClick={() => setSetupStep('choice')}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
              >
                Back to options
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Lock className="w-16 h-16 text-teal-600 dark:text-teal-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Journal Locked
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Authenticate to access your private journal
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          {biometricConfigured && (
            <button
              onClick={() => setAuthMethod('biometric')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                authMethod === 'biometric'
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Biometric
            </button>
          )}
          {pinConfigured && (
            <button
              onClick={() => setAuthMethod('pin')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                authMethod === 'pin'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              PIN
            </button>
          )}
        </div>

        {authMethod === 'biometric' ? (
          <div className="space-y-4">
            <button
              onClick={handleBiometricAuth}
              className="w-full flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-lg transition-colors"
            >
              <Fingerprint className="w-6 h-6" />
              Authenticate with Biometric
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter your PIN"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-center text-2xl tracking-widest"
            />
            <button
              onClick={handlePINAuth}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Unlock
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-700 dark:text-red-300 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
