import React from 'react';

import { FilterI } from '../components/DropdownFilter/dropdownFilter';
import { TableRowI } from '../components/Table/table';

export const scrollTo = (y: number) => {
  window.scrollTo({
    behavior: 'smooth',
    left: 0,
    top: y,
  });
};

export const scrollToId = (id: string, ref?: HTMLElement) => {
  let element = ref;
  if (!ref) {
    element = document.querySelector(`#${id}`) as HTMLElement;
  }
  if (element) {
    scrollTo(element.offsetTop);
  }
};

export const focusId = (id: string, scroll = true) => {
  const elementToFocus = document.querySelector(`#${id}`) as HTMLElement;
  if (elementToFocus) {
    elementToFocus?.setAttribute('tabindex', '0');
    if (scroll) {
      scrollToId(id, elementToFocus);
    }
    elementToFocus?.focus({ preventScroll: true });
    elementToFocus.onblur = () => {
      elementToFocus?.removeAttribute('tabindex');
    };
  }
};

export const mapOptions = (
  arrayToMap: { [key: string]: string | number }[]
) => {
  const arrayMapped: FilterI[] = [];
  arrayToMap?.map((elem) => {
    arrayMapped.push({ label: elem.nome?.toString(), value: elem.id });
  });
  return arrayMapped;
};

export const CRUDActionTypes = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  CLONE: 'clone',
  INFO: 'info',
  SEND: 'send',
  PRINT: 'print',
  COMPILE: 'compile',
};

export interface CRUDActionsI {
  [action: string]: (item: TableRowI | string) => void;
}

export interface FormActionsI {
  [action: string]: () => void;
}

export interface ItemsListI {
  title?: string;
  items: {
    nome: string;
    actions: CRUDActionsI;
    status?: string;
    stato?: string;
    id?: string;
    fullInfo?: {
      [key: string]: string;
    };
  }[];
}

export const menuRoutes = [
  { label: 'Home', path: '/', id: 'tab-home' },
  {
    label: 'Area amministrativa',
    path: '/area-amministrativa',
    id: 'tab-admin',
    subRoutes: [
      {
        label: 'Programmi',
        path: '/area-amministrativa/programmi',
      },
      {
        label: 'Progetti',
        path: '/area-amministrativa/progetti',
      },
      {
        label: 'Enti',
        path: '/area-amministrativa/enti',
      },
      {
        label: 'Utenti',
        path: '/area-amministrativa/utenti',
      },
      {
        label: 'Questionari',
        path: '/area-amministrativa/questionari',
      },
    ],
  },
  {
    label: 'Area cittadini',
    path: '/area-cittadini',
    id: 'tab-citizen',
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
    id: 'tab-dashboard',
  },
  {
    label: 'Community',
    path: '/community',
    id: 'tab-community',
  },
  {
    label: 'Bacheca digitale',
    path: '/bacheca-digitale',
    id: 'tab-bacheca-digitale',
  },
  {
    label: 'Documenti',
    path: '/documents',
    id: 'tab-documenti',
  },
];

// Flattens all child elements into a single list
// @ts-ignore
const flatten = (children: React.ReactElement, flat = []) => {
  // @ts-ignore
  flat = [...flat, ...React.Children.toArray(children)];

  if (children.props && children.props.children) {
    return flatten(children.props.children, flat);
  }

  return flat;
};

// Strips all circular references and internal fields
export const simplify = (children: React.ReactElement) => {
  const flat = flatten(children);

  // @ts-ignore
  return flat.map(({ key, ref, type, props: { children, ...props } }) => ({
    key,
    ref,
    type,
    props,
  }));
};
