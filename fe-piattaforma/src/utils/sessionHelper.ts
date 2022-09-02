export const getSessionValues = (key: string) => {
  return sessionStorage.getItem(key) || '{}';
};

export const setSessionValues = (key: string, data: any) => {
  const value = typeof data === 'string' ? data : JSON.stringify(data);
  sessionStorage.setItem(key, value);
};

export const clearSessionValues = (key?: string) => {
  if (key) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.clear();
  }
};
