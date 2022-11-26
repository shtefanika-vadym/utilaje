import { UTILAJES_ADMIN_ACCESS_TOKEN } from 'common/constants/constants'

const doLogout = (): void => {
  localStorage.removeItem(UTILAJES_ADMIN_ACCESS_TOKEN)
}

const setToken = (token: string): void => {
  localStorage.setItem(UTILAJES_ADMIN_ACCESS_TOKEN, token)
}

const getToken = (): string => {
  return localStorage.getItem(UTILAJES_ADMIN_ACCESS_TOKEN)
}

export const AuthService = {
  doLogout,
  getToken,
  setToken,
}
