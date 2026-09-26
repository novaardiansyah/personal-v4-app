export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || null

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface AuthUserData {
  id?: number | string;
  name: string;
  email: string;
  avatar_url?: string | null;
}

export interface AuthResponseData {
  token: string;
  user: AuthUserData;
}

async function postRequest<T>(endpoint: string, body: Record<string, any>): Promise<ApiResponse<T>> {
  const cleanBase = (API_BASE_URL || '').replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const url = `${cleanBase}/${cleanEndpoint}`;

  console.log('URL', url)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (data && typeof data === 'object') {
        return {
          success: false,
          message: data.message || 'Terjadi kesalahan pada server.',
          errors: data.errors || {},
        };
      }
      return {
        success: false,
        message: `Permintaan gagal dengan status ${response.status}.`,
      };
    }

    return (
      data || {
        success: true,
        message: 'Berhasil',
      }
    );
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.message ||
        'Gagal terhubung ke server. Periksa koneksi internet Anda.',
    };
  }
}

/**
 * Endpoint Login Mobile
 */
export async function loginMobileApi(credentials: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponseData>> {
  return postRequest<AuthResponseData>('auth/login', credentials);
}

/**
 * Endpoint Registrasi Mobile
 */
export async function registerMobileApi(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponseData>> {
  return postRequest<AuthResponseData>('auth/register', payload);
}
