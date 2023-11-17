import { RefreshSPIDToken } from "../redux/features/auth/authThunk";

export const getSessionValues = (key: string) => {
  return sessionStorage.getItem(key) || '{}';
};

export const setSessionValues = (key: string, data: any) => {
  const value =
    typeof data === 'string'
      ? data
      : JSON.stringify({ ...data, session_timestamp: new Date().getTime() });
  sessionStorage.setItem(key, value);
};

export const clearSessionValues = (key?: string) => {
  if (key) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.clear();
  }
};

const refreshSession = async (currentSession: {
  preAuthCode: string;
  refresh_token: string;
}) => {
  try {
    console.log('Refreshing auth session..');
    const { preAuthCode, refresh_token } = currentSession;
    const newSession = await RefreshSPIDToken(preAuthCode, refresh_token);
    if (newSession?.access_token) {
      setSessionValues('auth', {
        ...currentSession,
        ...newSession,
        session_timestamp: new Date().getTime(),
      });
    }
  } catch (err) {
    console.log('refreshSession error', err);
  }
};

export const validateSession = () => {
  const currentSession = getSessionValues('auth') !== 'fguhbjinokj8765d578t9yvghugyftr646tg' ? JSON.parse(getSessionValues('auth')) : getSessionValues('auth');
  if (currentSession?.refresh_token) {
    const diff =
      Math.abs(new Date().getTime() - currentSession.session_timestamp) / 1000;
    if (diff >= (currentSession.expires_in || 3600) - 600) {
      refreshSession(currentSession);
    } 
  }
};
