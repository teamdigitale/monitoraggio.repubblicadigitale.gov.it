import React, { useEffect, useState } from 'react';
import {
  Breadcrumb as BreadcrumbKit,
  BreadcrumbItem,
  Container,
} from 'design-react-kit';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import isEqual from 'lodash.isequal';
import { useSelector } from 'react-redux';
import {
  selectCustomBreadcrumb,
  selectInfoIdsBreadcrumb,
} from '../../redux/features/app/appSlice';
import { useAppSelector } from '../../redux/hooks';
import { selectProfile } from '../../redux/features/user/userSlice';
import { userRoles } from '../../pages/administrator/AdministrativeArea/Entities/utils';

export interface BreadcrumbI {
  label?: string;
  url?: string;
  link: boolean;
}

const Breadcrumb = () => {
  const userProfile = useAppSelector(selectProfile);
  const breadcrumbList = useSelector(selectCustomBreadcrumb);
  const idsBreadcrumb = useSelector(selectInfoIdsBreadcrumb);
  const urlCurrentLocation = useLocation().pathname;
  const location = useLocation()
    .pathname.split('/')
    .filter((elem) => elem !== '');
  const [currentLocation, setCurrentLocation] = useState<string[]>();
  const [navigationList, setNavigationList] = useState<BreadcrumbI[]>([]);

  const createUrl = (index: number) => {
    let url = '';
    (currentLocation || []).map((elem: string, i: number) => {
      if (elem !== '' && i <= index) {
        url = url + '/' + currentLocation?.[i];
      }
    });
    return url;
  };

  const getLabelBreadcrumb = (pathElem: string) => {
    let breadcrumbLabel;
    if (idsBreadcrumb.filter((x) => x?.id?.toString() === pathElem)[0]) {
      breadcrumbLabel = idsBreadcrumb.filter(
        (x) => x?.id?.toString() === pathElem
      )[0].nome;
    } else {
      switch (pathElem) {
        case 'area-amministrativa':
          return 'Area amministrativa';
        case 'area-cittadini':
          return 'Area cittadini';
        default:
          breadcrumbLabel =
            pathElem.charAt(0).toUpperCase() +
            pathElem.slice(1, pathElem.length).replaceAll('-', ' ');
          break;
      }
    }
    return decodeURI(breadcrumbLabel);
  };

  const getUrlBreadcrumbList = () => {
    let urlStore = '';
    breadcrumbList.map((elem, index) => {
      index === 0
        ? (urlStore = urlStore + elem.url)
        : (urlStore = urlStore + '/' + elem.url);
    });
    return urlStore;
  };

  useEffect(() => {
    if (!isEqual(location, currentLocation)) {
      setCurrentLocation(location);
    }
  }, [location]);

  useEffect(() => {
    if (
      breadcrumbList?.length > 0 &&
      getUrlBreadcrumbList() === urlCurrentLocation
    ) {
      setNavigationList(breadcrumbList);
    } else if (currentLocation && currentLocation?.length) {
      const newList: { label: string; url: string; link: boolean }[] = [];
      (currentLocation || []).map((elem: string, index: number) => {
        if (elem !== '') {
          if (
            currentLocation?.length > 3 &&
            index < currentLocation?.length - 1
          ) {
            newList.push({
              label: getLabelBreadcrumb(elem),
              url: createUrl(index),
              link:
                ((userProfile?.codiceRuolo === userRoles.REGP ||
                  userProfile?.codiceRuolo === userRoles.DEGP ||
                  userProfile?.codiceRuolo === userRoles.FAC ||
                  userProfile?.codiceRuolo === userRoles.VOL) &&
                  getLabelBreadcrumb(elem) === 'Progetti') ||
                ((userProfile?.codiceRuolo === userRoles.REG ||
                  userProfile?.codiceRuolo === userRoles.DEG ||
                  userProfile?.codiceRuolo === userRoles.REGP ||
                  userProfile?.codiceRuolo === userRoles.DEGP ||
                  userProfile?.codiceRuolo === userRoles.FAC ||
                  userProfile?.codiceRuolo === userRoles.VOL) &&
                  getLabelBreadcrumb(elem) === 'Programmi')
                  ? false
                  : index !== 0 && index !== currentLocation?.length - 2,
            });
          } else if (currentLocation?.length <= 3) {
            newList.push({
              label: getLabelBreadcrumb(elem),
              url: createUrl(index),
              link:
                ((userProfile?.codiceRuolo === userRoles.REGP ||
                  userProfile?.codiceRuolo === userRoles.DEGP) &&
                  getLabelBreadcrumb(elem) === 'Progetti') ||
                ((userProfile?.codiceRuolo === userRoles.REG ||
                  userProfile?.codiceRuolo === userRoles.DEG) &&
                  getLabelBreadcrumb(elem) === 'Programmi')
                  ? false
                  : index !== 0 && index !== currentLocation?.length - 1,
            });
          }
        }
        setNavigationList(newList);
      });
    }
  }, [currentLocation, currentLocation?.length, idsBreadcrumb, breadcrumbList]);

  return (
    <Container className='mt-3 pl-0'>
      <BreadcrumbKit className='mt-4 pt-4'>
        {(navigationList || []).map((item, index) => (
          <BreadcrumbItem key={index} className='mb-2'>
            {item.link && item.url ? (
              <NavLink
                to={item.url}
                className='primary-color font-weight-semibold text-decoration-underline'
                replace
              >
                {item.label}
              </NavLink>
            ) : (
              <span
                className={clsx(index === 0 && 'font-weight-semibold pl-2')}
                style={{
                  borderLeft: index === 0 ? '4px solid #0073E5' : 'none',
                }}
              >
                {item.label}
              </span>
            )}
            {index < navigationList.length - 1 && (
              <span className='separator'>/</span>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbKit>
    </Container>
  );
};

export default Breadcrumb;
