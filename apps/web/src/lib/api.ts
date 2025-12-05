import { getSession } from 'next-auth/react';

// En production: https://kidverse.app/api
// En développement: http://localhost:3000/api (proxy vers localhost:4000)
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiOptions {
  method?: RequestMethod;
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  return headers;
}

export async function api<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers: customHeaders = {},
    cache,
    revalidate,
    tags,
  } = options;

  const authHeaders = await getAuthHeaders();

  const config: RequestInit = {
    method,
    headers: {
      ...authHeaders,
      ...customHeaders,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  if (cache) {
    config.cache = cache;
  }

  // Next.js specific options
  if (revalidate !== undefined || tags) {
    (config as any).next = {
      ...(revalidate !== undefined && { revalidate }),
      ...(tags && { tags }),
    };
  }

  // Utilise le proxy Next.js pour les appels API
  // Les requêtes /api/* sont redirigées par next.config.js
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_URL}/api/v1${endpoint}`;

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP Error: ${response.status}`,
      response.status,
      errorData
    );
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}

// Convenience methods
export const apiGet = <T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) =>
  api<T>(endpoint, { ...options, method: 'GET' });

export const apiPost = <T = any>(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
  api<T>(endpoint, { ...options, method: 'POST', body });

export const apiPut = <T = any>(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
  api<T>(endpoint, { ...options, method: 'PUT', body });

export const apiPatch = <T = any>(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
  api<T>(endpoint, { ...options, method: 'PATCH', body });

export const apiDelete = <T = any>(endpoint: string, options?: Omit<ApiOptions, 'method'>) =>
  api<T>(endpoint, { ...options, method: 'DELETE' });

// React Query helpers
export const queryKeys = {
  // Auth
  user: ['user'] as const,
  
  // Children
  children: ['children'] as const,
  child: (id: string) => ['children', id] as const,
  
  // Staff
  staff: ['staff'] as const,
  staffMember: (id: string) => ['staff', id] as const,
  
  // Centers
  centers: ['centers'] as const,
  center: (id: string) => ['centers', id] as const,
  
  // Attendance
  attendance: (date: string) => ['attendance', date] as const,
  childAttendance: (childId: string) => ['attendance', 'child', childId] as const,
  
  // Classrooms
  classrooms: (centerId?: string) => ['classrooms', centerId] as const,
  classroom: (id: string) => ['classrooms', id] as const,
} as const;

export { ApiError };


