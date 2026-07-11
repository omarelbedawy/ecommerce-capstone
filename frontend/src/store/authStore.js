import { create } from 'zustand';

// pulling from sessionStorage on init so a page refresh doesn't log people out
// (not localStorage - tokens shouldn't outlive the browser session)
const savedUser = sessionStorage.getItem('user');

export const useAuthStore = create((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  accessToken: sessionStorage.getItem('accessToken') || null,
  refreshToken: sessionStorage.getItem('refreshToken') || null,

  login: (user, accessToken, refreshToken) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
    set({ user, accessToken, refreshToken });
  },

  setAccessToken: (accessToken) => {
    sessionStorage.setItem('accessToken', accessToken);
    set({ accessToken });
  },

  logout: () => {
    sessionStorage.clear();
    set({ user: null, accessToken: null, refreshToken: null });
  },
}));
