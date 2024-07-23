import moment from 'moment';
import React from 'react';

import { FilterI } from '../components/DropdownFilter/dropdownFilter';
import { OptionType } from '../components/Form/select';
import { TableRowI } from '../components/Table/table';
import {
  idQ1,
  idQ2,
  idQ3,
  idQ4,
  titleQ1,
  titleQ2,
  titleQ3,
  titleQ4,
} from '../pages/administrator/AdministrativeArea/Entities/Surveys/surveyConstants';
import { RolePermissionI } from '../redux/features/roles/rolesSlice';
import { formFieldI } from './formHelper';
import { DeviceI } from '../redux/features/app/appSlice';
import { getSessionValues } from './sessionHelper';
import store from '../redux/store';
import { GetNotificationsByUser } from '../redux/features/user/userThunk';
import { setUserNotificationsToRead } from '../redux/features/user/userSlice';
import pako from 'pako'

export const getUserIdsFromNotification = (notification: string) => {
  // ex. Utente userId:$userId$ ha segnalato il post di authorId:$authorId$
  const splittedNotification = notification.split('$');

  return {
    userId: splittedNotification[1],
    authorId: splittedNotification[3],
  };
};

export const formatDate = (date?: string) => {
  if (date) {
    return moment(date).format('DD-MM-YYYY');
  }

  return undefined;
};

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

export const mapOptionsCitizens = (
  arrayToMap: { [key: string]: string | number }[]
) => {
  const arrayMapped: FilterI[] = [];
  arrayToMap?.map((elem) => {
    arrayMapped.push({
      label:
        elem.nome.toString().charAt(0).toUpperCase() +
        elem.nome.toString().slice(1).toLowerCase(),
      value: elem.id,
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
  DOWNLOAD: 'download',
};

export interface CRUDActionsI {
  [action: string]: (item: TableRowI | string) => void;
}

export interface FormActionsI {
  [action: string]: () => void;
}

export interface ItemListElemI {
  associatoAUtente?: boolean;
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
        visible: ['tab.am', 'subtab.quest'],
      }),
      newMenuItem({
        label: 'Servizi',
        path: '/area-amministrativa/servizi',
        visible: ['tab.am', 'subtab.serv'],
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
    label: 'Report dati',
    path: '/report-dati',
    id: 'tab-dashboard',
    visible: ['tab.dshb'],
  }),
  newMenuItem({
    label: 'Bacheca',
    path: '/bacheca',
    id: 'tab-bacheca-digitale',
    visible: ['tab.bach'],
  }),
  newMenuItem({
    label: 'Forum',
    path: '/forum',
    id: 'tab-forum',
    visible: ['tab.comm'],
  }),
  newMenuItem({
    label: 'Documenti',
    path: '/documenti',
    id: 'tab-documenti',
    visible: ['tab.doc'],
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
  const target = document.getElementById('file-target');
  if (target) {
    target.appendChild(link);
    link.click();
    target.removeChild(link);
  } else {
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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
  [key: string]: { label: string; value: string | number }[] | undefined;
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
    } else if (filters[filter]?.length) {
      (filters[filter] || []).map(
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

export const getUrlParameter = (parameterName: string) => {
  let result = null,
    tmp = [];
  window.location.search
    .substring(1)
    .split('&')
    .forEach((item) => {
      tmp = item.split('=');
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
};

export const formatAndParseJsonString = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    try {
      return JSON.parse(decodeURI(jsonString)?.replace(/\s+/g, ' ')?.trim());
    } catch (error) {
      try {
        return JSON.parse(decodeURI(jsonString)?.replaceAll("'", '"'));
      } catch (error) {
        return '';
      }
    }
  }
};

export const createStringOfCompiledSurveySection = (
  formValues: { [key: string]: formFieldI['value'] | undefined } | undefined
) => {
  if (formValues === undefined) return '';
  const formattedData = { ...formValues };
  Object.keys(formattedData).forEach((key: string) => {
    if (!Array.isArray(formattedData[key])) {
      formattedData[key] = formattedData[key]
        ?.toString()
        .split('§')
        .map((e) => e.replaceAll(',', '§').replaceAll("'", '’'));
    } else if (Array.isArray(formattedData[key])) {
      if (key === '25' || key === '26') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formattedData[key] = (formattedData[key] || ['']).map((e) =>
          e.toString().replaceAll(',', '§').replaceAll("'", '’')
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      } else if (formattedData[key].length === 1) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formattedData[key] = (formattedData[key] || [''])[0]
          .toString()
          .split('§')
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .map((e) => e.toString().replaceAll(',', '§').replaceAll("'", '’'));
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formattedData[key] = (formattedData[key] || ['']).map((e) =>
          e.toString().replaceAll(',', '§').replaceAll("'", '’')
        );
      }
    }
  });
  const newData: { [key: string]: any }[] = [];
  Object.keys(formattedData).forEach((key: string) => {
    newData.push({ [key]: formattedData[key] });
  });
  return JSON.stringify(newData);
};

export const convertPayloadSectionInString = (
  sectionPayload: {
    [key: string]: formFieldI['value'];
  },
  section: number
) => {
  const newObject: { [key: string]: string[] } = {};
  Object.keys(sectionPayload).map((key: string) => {
    if (sectionPayload[key]) {
      if (
        typeof sectionPayload[key] === 'string' ||
        typeof sectionPayload[key] === 'number' ||
        typeof sectionPayload[key] === 'boolean'
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newObject[key] = [sectionPayload[key]];
      } else if (Array.isArray(sectionPayload[key])) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newObject[key] = sectionPayload[key];
      } else {
        newObject[key] = [''];
      }
    }
  });
  switch (section) {
    case 0:
      return `{"id":"${idQ1}","title":"${titleQ1}","properties":${createStringOfCompiledSurveySection(
        newObject
      ).replaceAll('"', "'")}}`;

    case 1:
      return `{"id":"${idQ2}","title":"${titleQ2}","properties":${createStringOfCompiledSurveySection(
        newObject
      ).replaceAll('"', "'")}}`;
    case 2:
      return `{"id":"${idQ3}","title":"${titleQ3}","properties":${createStringOfCompiledSurveySection(
        newObject
      ).replaceAll('"', "'")}}`;
    case 3:
      return `{"id":"${idQ4}","title":"${titleQ4}","properties":${createStringOfCompiledSurveySection(
        newObject
      ).replaceAll('"', "'")}}`;
    default:
      return createStringOfCompiledSurveySection(newObject);
  }
};

export const orderArray = (array: any[]) => {
  if (array?.length) {
    return array.sort((a, b) => {
      const labelA = a.label.toLowerCase();
      const labelB = b.label.toLowerCase();
      if (labelA < labelB) return -1;
      if (labelA > labelB) return 1;
      return 0;
    });
  } else {
    return array;
  }
};

export const getMediaQueryDevice = ({
  mediaIsPhone,
  mediaIsTablet,
  mediaIsDesktop,
}: DeviceI) => {
  if (mediaIsDesktop) return 'desktop';
  if (mediaIsTablet) return 'tablet';
  if (mediaIsPhone) return 'mobile';
  return 'desktop';
};

export const cleanBase64 = (base64: string) => {
  try {
    const a = base64?.toString();
    const b = a.indexOf('base64');
    return a.slice(b, a.length).replace('base64,', '');
  } catch (err) {
    console.log('cleanBase64 error', err);
    return base64;
  }
};

export const uploadFile = (
  elementId = 'file',
  callback: (file: { data?: File; name?: string }) => void = () => ({})
) => {
  const input: HTMLInputElement = document.getElementById(
    elementId
  ) as HTMLInputElement;

  if (input.files?.length) {
    const selectedImage = input.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = () => {
      if (reader.result) {
        callback({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          data: cleanBase64(reader.result),
          name: selectedImage.name,
          res: reader.result,
        });
      }
    };

    /*
                                            const selectedFile = input.files[0];
                                            if (selectedFile) {
                                              file.data = selectedFile;
                                            }
                                        
                                            const reader = new FileReader();
                                            reader.readAsDataURL(selectedFile);
                                            reader.onloadend = () => {
                                              file.name = selectedFile.name as string;
                                              callback(file);
                                            };
                                            */
  }
};

export const cleanDrupalFileURL = (url: string) => url.replaceAll('amp;', '');

export const getUnreadNotificationsCount = (force = false) => {
  const notificationSession = JSON.parse(getSessionValues('notification'));

  if (notificationSession.session_timestamp) {
    const diff =
      Math.abs(new Date().getTime() - notificationSession.session_timestamp) /
      1000;
    if (force || diff >= 120) {
      store.dispatch(
        GetNotificationsByUser(
          {
            status: [{ value: 0 }],
            items_per_page: [{ value: 9 }],
            page: [{ value: 0 }],
            sort: [{ value: 'created_desc' }],
          },
          true
        ) as any
      );
    } else {
      if (
        notificationSession.notificationToRead !==
        store.getState().user.notificationToRead
      )
        store.dispatch(
          setUserNotificationsToRead(notificationSession.notificationToRead)
        );
    }
  } else {
    store.dispatch(
      GetNotificationsByUser(
        {
          status: [{ value: 0 }],
          items_per_page: [{ value: 9 }],
          page: [{ value: 0 }],
          sort: [{ value: 'created_desc' }],
        },
        true
      ) as any
    );
  }
};

export const isSafariBrowser = () => {
  const isChrome = navigator.userAgent.indexOf('Chrome') > -1;
  const isSafari = navigator.userAgent.indexOf('Safari') > -1;

  if (isSafari) {
    if (isChrome)
      // Chrome seems to have both Chrome and Safari userAgents
      return false;
    else return true;
  }
  return false;
};

export function convertBase64ToFile(
  fileContent: string,
  fileName: string,
  fileType: string
) {
  const byteCharacter = window.atob(fileContent);
  const buffer = new ArrayBuffer(byteCharacter.length);
  const content = new Uint8Array(buffer);

  for (let i = 0; i < byteCharacter.length; i++) {
    content[i] = byteCharacter.charCodeAt(i);
  }

  const blob = new Blob([buffer]);
  return new File([blob], fileName, { type: fileType });
}

export function downloadGeneratedFile(file: File) {
  const url = window.URL.createObjectURL(file);
  const link = document.createElement('a');

  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function cutValueAfterRange(value: string, range: number): string {
  return value.trim().substring(0, range);
}


export const compressPayload = (payload: any) => {
  const jsonString = JSON.stringify(payload);
  const compressed = pako.gzip(jsonString);
  return new Blob([compressed], { type: 'application/gzip' });
};

export const toBase64 = (file: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    try {
      const result = reader.result;
      if (typeof result === 'string' && result.includes(',')) {
        resolve(result.split(',')[1]);
      } else {
        throw new Error('Invalid result format');
      }
    } catch (error) {
      reject(error);
    }
  };

  reader.onerror = error => reject(error);
});
