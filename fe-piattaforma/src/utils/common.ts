import React from 'react';

import { FilterI } from '../components/DropdownFilter/dropdownFilter';
import { OptionType } from '../components/Form/select';
import { TableRowI } from '../components/Table/table';
import { RolePermissionI } from '../redux/features/roles/rolesSlice';

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
    arrayMapped.push({
      label:
        elem.toString().charAt(0).toUpperCase() +
        elem.toString().slice(1).toLowerCase(),
      value: elem.toString(),
    });
  });
  return arrayMapped;
};

export const filterObjectByKey = (obj: any, filteringKey: string) =>
  obj
    ? Object.fromEntries(
        Object.keys(obj)
          .filter((key) => key.includes(filteringKey) && obj[key])
          .map((key) => [key, obj[key] as string])
      )
    : {};

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
  SELECT: 'select',
  PREVIEW: 'preview',
};

export interface CRUDActionsI {
  [action: string]: (item: TableRowI | string) => void;
}

export interface FormActionsI {
  [action: string]: () => void;
}

export interface ItemListElemI {
  nome: string;
  cognome?: string;
  actions: CRUDActionsI;
  status?: string;
  stato?: string;
  id?: string;
  fullInfo?: {
    [key: string]: string;
  };
  default?: boolean;
  codiceFiscale?: string;
}

export interface ItemsListI {
  title?: string;
  items: ItemListElemI[];
}

export interface MenuItem {
  label: string;
  path: string;
  id?: string;
  subRoutes?: MenuItem[];
  visible?: RolePermissionI[];
}

const newMenuItem = ({
  label,
  path,
  id = label,
  visible = [],
  subRoutes = [],
}: MenuItem) => ({
  label,
  path,
  id,
  visible,
  subRoutes,
});
export const MenuRoutes = [
  newMenuItem({
    label: 'Home',
    path: '/',
    id: 'tab-home',
  }),
  newMenuItem({
    label: 'Area amministrativa',
    path: '/area-amministrativa',
    id: 'tab-admin',
    visible: ['tab.am'],
    subRoutes: [
      newMenuItem({
        label: 'Programmi',
        path: '/area-amministrativa/programmi',
        visible: ['tab.am', 'subtab.prgm'],
      }),
      newMenuItem({
        label: 'Progetti',
        path: '/area-amministrativa/progetti',
        visible: ['tab.am', 'subtab.prgt'],
      }),
      newMenuItem({
        label: 'Enti',
        path: '/area-amministrativa/enti',
        visible: ['tab.am', 'subtab.enti'],
      }),
      newMenuItem({
        label: 'Utenti',
        path: '/area-amministrativa/utenti',
        visible: ['tab.am', 'subtab.utenti'],
      }),
      newMenuItem({
        label: 'Questionari',
        path: '/area-amministrativa/questionari',
        visible: ['tab.am'],
      }),
      newMenuItem({
        label: 'Servizi',
        path: '/area-amministrativa/servizi',
        visible: ['tab.am'],
      }),
    ],
  }),
  newMenuItem({
    label: 'Area cittadini',
    path: '/area-cittadini',
    id: 'tab-citizen',
    visible: ['tab.citt'],
  }),
  newMenuItem({
    label: 'Dashboard',
    path: '/dashboard',
    id: 'tab-dashboard',
    //visible: // TODO implement condition based on role permission
  }),
  newMenuItem({
    label: 'Community',
    path: '/community',
    id: 'tab-community',
    visible: [process.env.NODE_ENV === 'development' ? 'visible' : 'hidden'],
  }),
  newMenuItem({
    label: 'Bacheca digitale',
    path: '/bacheca-digitale',
    id: 'tab-bacheca-digitale',
    visible: [process.env.NODE_ENV === 'development' ? 'visible' : 'hidden'],
  }),
  newMenuItem({
    label: 'Documenti',
    path: '/documenti',
    id: 'tab-documenti',
    visible: [process.env.NODE_ENV === 'development' ? 'visible' : 'hidden'],
  }),
];

// Flattens all child elements into a single list
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const flatten = (children: React.ReactElement, flat = []) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return flat.map(({ key, ref, type, props: { ...props } }) => ({
    key,
    ref,
    type,
    props,
  }));
};

export const downloadFile = (file: string, fileName: string) => {
  const link = document.createElement('a');
  link.setAttribute('href', file);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadBlob = (
  content: string,
  filename: string,
  contentType: string
) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
};

const transformToCSV = (data: string) => {
  const rows = data.split('\r\n').map((r) => r.split(','));
  return rows.map((r) => r.join(';')).join('\r\n');
};

export const downloadCSV = (
  data: string,
  filename = 'my_data.csv',
  toTransform = false
) => {
  let csvData = data;
  if (toTransform) {
    csvData = transformToCSV(data);
  }
  downloadBlob(csvData, filename, 'text/csv;charset=utf-8;');
};

export const transformFiltersToQueryParams = (filters: {
  [key: string]: { label: string; value: string }[] | undefined;
}) => {
  let filterString = '';
  Object.keys(filters)?.forEach((filter: string) => {
    if (filter === 'criterioRicerca' || filter === 'filtroCriterioRicerca') {
      if (filters[filter])
        filterString =
          filterString +
          (filterString !== '' ? '&' : '') +
          filter +
          '=' +
          filters[filter];
    } else {
      filters[filter]?.map(
        (value: OptionType) =>
          (filterString =
            filterString +
            (filterString !== '' ? '&' : '') +
            filter +
            '=' +
            value?.value)
      );
    }
  });
  return filterString === '' ? filterString : '?' + filterString;
};
