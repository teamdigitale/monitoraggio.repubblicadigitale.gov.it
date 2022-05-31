import { LinkList, LinkListItem, Navbar } from 'design-react-kit';
import React from 'react';

interface LinksI {
  name: string;
  url: string;
}

export interface SidebarI {
  links: LinksI[];
  className?: string;
}

const Sidebar: React.FC<SidebarI> = ({ links, className }) => {
  return (
    <Navbar
      className={`inline-menu affix-top ${className}`}
      cssModule={{ navbar: ' ' }}
      aria-label='Barra di navigazione laterale'
    >
      <LinkList>
        {links.map((link, id: number) => (
          <LinkListItem href={link.url} key={id} className='pr-5'>
            <span>{link.name}</span>
          </LinkListItem>
        ))}
      </LinkList>
    </Navbar>
  );
};

export default Sidebar;
