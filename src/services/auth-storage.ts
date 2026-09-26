import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/context/auth-context';

export interface StoredAuthSession {
  user: User;
  token: string;
  expires_at: string;
  saved_at: string;
}

const AUTH_STORAGE_KEY = '@personal_v4_auth_session';

/**
 * Cek apakah session telah melewati masa kedaluwarsa (7 hari).
 */
export function isSessionExpired(session: StoredAuthSession | null): boolean {
  if (!session || !session.token) {
    return true;
  }

  const now = Date.now();

  if (session.expires_at) {
    const expireTime = new Date(session.expires_at).getTime();
    if (!isNaN(expireTime)) {
      return now >= expireTime;
    }
  }

  if (session.saved_at) {
    const savedTime = new Date(session.saved_at).getTime();
    if (!isNaN(savedTime)) {
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      return now >= savedTime + sevenDaysMs;
    }
  }

  return false;
}

/**
 * Simpan sesi autentikasi dan token ke local storage (7 hari).
 */
export async function saveAuthSession(data: {
  user: User;
  token: string;
  expires_at?: string | null;
}): Promise<void> {
  try {
    const now = new Date();
    // Default expired 7 hari jika tidak ada tanggal dari API
    const defaultExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const session: StoredAuthSession = {
      user: {
        ...data.user,
        token: data.token,
      },
      token: data.token,
      expires_at: data.expires_at || defaultExpiry,
      saved_at: now.toISOString(),
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Fail-safe jika storage tidak dapat ditulis
  }
}

/**
 * Ambil sesi autentikasi yang tersimpan.
 */
export async function getAuthSession(): Promise<StoredAuthSession | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const session = JSON.parse(raw) as StoredAuthSession;
    if (isSessionExpired(session)) {
      await clearAuthSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Hapus sesi autentikasi dari local storage.
 */
export async function clearAuthSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Fail-safe
  }
}
