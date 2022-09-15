import React, { useEffect, useState } from 'react';
import { focusId } from '../../utils/common';

const defaultSkipLinkList = [
  { label: 'Vai al menu', id: 'menu' },
  { label: 'Vai al contenuto principale', id: 'main' },
];

const SkipContent: React.FC = () => {
  const [skipLinkList, setSkipLinkList] = useState(defaultSkipLinkList);

  useEffect(() => {
    // TODO update skipLinkList with dynamic page elements
    setSkipLinkList([...defaultSkipLinkList]);
  }, []);

  const skipToContent = (id: string) => {
    focusId(id);
  };

  return (
    <>
      {skipLinkList.map((link) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
          key={link.id}
          className='skip-main'
          href={`#${link.id}`}
          onClick={() => skipToContent(link.id)}
          tabIndex={0}
        >
          {link.label}
        </a>
      ))}
    </>
  );
};

export default SkipContent;
