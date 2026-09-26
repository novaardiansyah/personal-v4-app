export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || null;

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

async function request<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: Record<string, any>;
    token?: string | null;
  } = {}
): Promise<ApiResponse<T>> {
  const cleanBase = (API_BASE_URL || '').replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const url = `${cleanBase}/${cleanEndpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  try {
    const response = await fetch(url, {
      method: options.method || 'POST',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
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
  return request<AuthResponseData>('auth/login', {
    method: 'POST',
    body: credentials,
  });
}

/**
 * Endpoint Registrasi Mobile
 */
export async function registerMobileApi(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponseData>> {
  return request<AuthResponseData>('auth/register', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Endpoint Ambil Data Profile
 */
export async function getProfileMobileApi(token?: string | null): Promise<ApiResponse<{ user: AuthUserData }>> {
  return request<{ user: AuthUserData }>('auth/profile', {
    method: 'GET',
    token,
  });
}

/**
 * Endpoint Update Profile (Nama, Email, Avatar Base64/URL)
 */
export async function updateProfileMobileApi(
  payload: {
    name: string;
    email?: string;
    avatar_base64?: string | null;
    avatar_url?: string | null;
  },
  token?: string | null
): Promise<ApiResponse<{ user: AuthUserData }>> {
  return request<{ user: AuthUserData }>('auth/profile', {
    method: 'POST',
    body: payload,
    token,
  });
}

/**
 * Endpoint Ganti Kata Sandi Mobile
 */
export async function changePasswordMobileApi(
  payload: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  },
  token?: string | null
): Promise<ApiResponse<{ token?: string; user?: AuthUserData }>> {
  return request<{ token?: string; user?: AuthUserData }>('auth/change-password', {
    method: 'POST',
    body: payload,
    token,
  });
}


