import clsx from 'clsx';
import { Button, Container, Icon } from 'design-react-kit';
import React, { memo, useState } from 'react';
import './pageTitle.scss';
import SectionInfo from '../../components/SectionInfo/sectionInfo';
import '../SectionInfo/sectionInfo.scss';
import { useLocation } from 'react-router-dom';
import { surveyBody } from '../SectionInfo/bodies';
import { useAppSelector } from '../../redux/hooks';
import { selectDevice } from '../../redux/features/app/appSlice';
import { selectUserNotification } from '../../redux/features/user/userSlice';

interface BreadcrumbI {
  label?: string;
  url?: string;
}
export interface PageTitleI {
  breadcrumb?: BreadcrumbI[];
  title?: string | undefined;
  subtitle?: string;
  hasBackground?: boolean;
  sectionInfo?: boolean;
  alignTitle?: boolean;
  badge?: boolean;
  cta?:
    | {
        action: () => void;
        label: string;
      }
    | undefined;
  innerHTML?: boolean;
  HTMLsubtitle?: string;
  defaultOpen?: boolean;
  lastUpdate?: string | null;
}

const PageTitle: React.FC<PageTitleI> = (props) => {
  const {
    cta,
    hasBackground,
    title,
    subtitle,
    lastUpdate,
    sectionInfo,
    alignTitle,
    badge,
    innerHTML,
    HTMLsubtitle = '',
    defaultOpen = false,
  } = props;

  const [sectionInfoOpened, setSectionInfoOpened] =
    useState<boolean>(defaultOpen);
  const device = useAppSelector(selectDevice);
  // TODO integrate notification count
  const notificationsList = useAppSelector(selectUserNotification);
  const location = useLocation();
  //const notificationsList = useAppSelector(selectNotificationList);

  const openSectionInfo = () => {
    setSectionInfoOpened((current) => !current);
  };

  const correctSectionTitle = () => {
    switch (location.pathname) {
      case '/area-amministrativa/questionari':
        return 'Come utilizzare la sezione questionari';
      default:
        return '';
    }
  };

  const correctSectionInfo = () => {
    switch (location.pathname) {
      case '/area-amministrativa/questionari':
        return surveyBody;
      case '/report-dati':
        return 'Per una consultazione ottimale dei grafici si consiglia di visualizzare la pagina da desktop';
      case '/documenti':
        return 'In Documenti puoi scoprire risorse utili per la gestione dei servizi a cui partecipi. Utilizza l’Area di collaborazione per lavorare in simultanea alla creazione di nuovi documenti con altri utenti aggiungendo il loro indirizzo email. Hai a disposizione fino a 1 Giga di spazio per caricare e condividere file in formato doc, docx, xls, .xlsx, ppt e pptx. Per accedere dopo esserti registrato, utilizza il tuo indirizzo email come username.';
      default:
        return '';
    }
  };

  return (
    <div className={clsx('page-title', hasBackground && 'lightgrey-bg-a1')}>
      <Container className={clsx('mt-3 pl-0', badge && 'd-flex')}>
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'align-items-center',
            alignTitle ? 'justify-content-center' : null,
            device.mediaIsPhone && !badge && 'container'
          )}
        >
          {title && (
            <h1
              className={clsx(
                'h2',
                'py-2',
                'mb-2',
                'primary-color-a9',
                'line-height',
                'word-spacing',
                device.mediaIsPhone && 'pl-1'
              )}
            >
              {title}
            </h1>
          )}
          {sectionInfo ? (
            <Button
              onClick={() => {
                openSectionInfo();
              }}
            >
              <Icon
                color='primary'
                icon='it-info-circle'
                size='sm'
                aria-label='Informazioni'
                aria-hidden
              />
            </Button>
          ) : null}
        </div>
        {subtitle || innerHTML ? (
          <div
            className={clsx(
              'd-flex',
              !device.mediaIsDesktop ? 'flex-column' : 'flex-row',
              'align-items-center',
              alignTitle ? 'justify-content-center' : null,
              cta && 'justify-content-between'
            )}
          >
            {innerHTML ? (
              <div
                dangerouslySetInnerHTML={{ __html: HTMLsubtitle }}
                className='section-info-list'
              />
            ) : lastUpdate ? (
              <div
                className={clsx(
                  'd-flex',
                  'flex-column',
                  !device.mediaIsDesktop && 'mb-4'
                )}
              >
                <p className={clsx('py-2', 'mb-2')}>{subtitle}</p>
                <p>
                  Ultimo aggiornamento <strong>{lastUpdate} ore 19:00</strong>
                </p>
              </div>
            ) : (
              <p className={clsx('py-2', 'mb-2')}>{subtitle}</p>
            )}
            {cta ? (
              <Button
                onClick={cta.action}
                color='primary'
                className={clsx(
                  'd-flex',
                  'flex-row',
                  'justify-content-around',
                  'align-items-center',
                  'mb-3'
                )}
              >
                <span className='text-nowrap pr-3'> {cta.label} </span>
                <Icon
                  icon='it-external-link'
                  color='white'
                  size='sm'
                  aria-label={cta.label}
                  aria-hidden
                />
              </Button>
            ) : null}
          </div>
        ) : null}
        {sectionInfo && sectionInfoOpened ? (
          <SectionInfo
            title={correctSectionTitle()}
            body={correctSectionInfo()}
            open={sectionInfoOpened}
            setIsOpen={(value) => {
              setSectionInfoOpened(value);
            }}
          />
        ) : null}
        {badge ? (
          <span className='badge-notifications'>
            {notificationsList?.length}
          </span>
        ) : null}
      </Container>
    </div>
  );
};

export default memo(PageTitle);
