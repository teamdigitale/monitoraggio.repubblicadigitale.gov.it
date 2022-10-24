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

export const validateSession = () => {
  const currentSession = JSON.parse(getSessionValues('auth'));
  const diff =
    Math.abs(new Date().getTime() - currentSession.session_timestamp) / 1000;
  //console.log('validation session..', diff);
  if (diff >= (currentSession.expires_in || 3600) - 600) {
    console.log('TODO refresh session');
  }
};
