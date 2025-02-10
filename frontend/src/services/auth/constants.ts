export const AUTH_STORAGE_KEYS = {
  TOKEN: '@KidsBookCreator:token',
  USER: '@KidsBookCreator:user'
} as const;

export const API_ROUTES = {
  LOGIN: '/auth/login',
  VERIFY: '/auth/verify',
  REGISTER: '/auth/register'
} as const;