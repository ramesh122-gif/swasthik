import { supabase } from './supabase';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

const CREDENTIAL_ID_KEY = 'journal_biometric_credential';

export async function isBiometricAvailable(): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    return false;
  }

  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return false;
  }
}

export async function setupBiometric(): Promise<BiometricAuthResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'Swasthik Mental Health',
        id: window.location.hostname,
      },
      user: {
        id: new TextEncoder().encode(user.id),
        name: user.email || 'user',
        displayName: user.email || 'User',
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },
        { alg: -257, type: 'public-key' },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      timeout: 60000,
      attestation: 'none',
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential;

    if (!credential) {
      return { success: false, error: 'Failed to create credential' };
    }

    localStorage.setItem(CREDENTIAL_ID_KEY, credential.id);

    const { error } = await supabase
      .from('user_security')
      .upsert({
        user_id: user.id,
        is_biometric_enabled: true,
        last_biometric_setup: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving biometric setup:', error);
      return { success: false, error: 'Failed to save settings' };
    }

    return { success: true };
  } catch (error) {
    console.error('Biometric setup error:', error);
    return { success: false, error: 'Failed to setup biometric authentication' };
  }
}

export async function authenticateWithBiometric(): Promise<BiometricAuthResult> {
  try {
    const credentialId = localStorage.getItem(CREDENTIAL_ID_KEY);
    if (!credentialId) {
      return { success: false, error: 'No biometric credential found. Please setup first.' };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: [
        {
          id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)),
          type: 'public-key',
        },
      ],
      timeout: 60000,
      userVerification: 'required',
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (!assertion) {
      return { success: false, error: 'Authentication failed' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Biometric authentication error:', error);

    if (error.name === 'NotAllowedError') {
      return { success: false, error: 'Authentication cancelled' };
    }

    return { success: false, error: 'Authentication failed. Please try again.' };
  }
}

export async function setupPIN(pin: string): Promise<BiometricAuthResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const encryptedPIN = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const { error } = await supabase
      .from('user_security')
      .upsert({
        user_id: user.id,
        encrypted_pin: encryptedPIN,
      });

    if (error) {
      console.error('Error saving PIN:', error);
      return { success: false, error: 'Failed to save PIN' };
    }

    return { success: true };
  } catch (error) {
    console.error('PIN setup error:', error);
    return { success: false, error: 'Failed to setup PIN' };
  }
}

export async function verifyPIN(pin: string): Promise<BiometricAuthResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('user_security')
      .select('encrypted_pin')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data) {
      return { success: false, error: 'No PIN found. Please setup first.' };
    }

    const encoder = new TextEncoder();
    const pinData = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', pinData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedInput = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashedInput === data.encrypted_pin) {
      return { success: true };
    }

    return { success: false, error: 'Incorrect PIN' };
  } catch (error) {
    console.error('PIN verification error:', error);
    return { success: false, error: 'Failed to verify PIN' };
  }
}

export async function isBiometricSetup(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_security')
      .select('is_biometric_enabled')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data) return false;

    return data.is_biometric_enabled || false;
  } catch (error) {
    console.error('Error checking biometric setup:', error);
    return false;
  }
}

export async function isPINSetup(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_security')
      .select('encrypted_pin')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data) return false;

    return !!data.encrypted_pin;
  } catch (error) {
    console.error('Error checking PIN setup:', error);
    return false;
  }
}
