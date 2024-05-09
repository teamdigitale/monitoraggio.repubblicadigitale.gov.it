type PathMap = { [key: string]: { title: string; description?: string } };

const pathMap: PathMap = {
  '/forum': {
    title: 'VAI AI TUOI ARGOMENTI',
    description: 'Tutti gli argomenti',
  },
  '/documenti': {
    title: 'VAI AI TUOI DOCUMENTI',
    description: 'Tutti i documenti',
  },
  '/bacheca': {
    title: 'VAI AI TUOI ANNUNCI',
    description: 'Tutti gli annunci',
  },
};

export const usePathContent = (pathName: string) => {
  const defaultContent = { title: 'CONTENUTI PUBBLICATI', description: '' };
  return pathMap[pathName] || defaultContent;
};

