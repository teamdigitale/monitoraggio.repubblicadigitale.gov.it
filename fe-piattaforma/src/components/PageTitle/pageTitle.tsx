import React, { memo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Container, Icon } from 'design-react-kit';
import clsx from 'clsx';
import '../SectionInfo/sectionInfo.scss';
import './pageTitle.scss';
import SectionInfo from '../../components/SectionInfo/sectionInfo';

import { surveyBody } from '../SectionInfo/bodies';

interface BreadcrumbI {
  label?: string;
  url?: string;
}
export interface PageTitleI {
  breadcrumb?: BreadcrumbI[];
  title?: string;
  subtitle?: string;
  hasBackground?: boolean;
  sectionInfo?: boolean;
  alignTitle?: boolean;
  cta?:
    | {
        action: () => void;
        label: string;
      }
    | undefined;
}

const PageTitle: React.FC<PageTitleI> = (props) => {
  const { cta, hasBackground, title, subtitle, sectionInfo, alignTitle } =
    props;

  const [sectionInfoOpened, setSectionInfoOpened] = useState<boolean>(false);
  const location = useLocation();

  const openSectionInfo = () => {
    setSectionInfoOpened((current) => !current);
  };

  const correctSectionInfo = () => {
    switch (location.pathname) {
      case '/area-amministrativa/questionari':
        return surveyBody;
      default:
        return '';
    }
  };

  return (
    <div className={clsx('page-title', hasBackground && 'lightgrey-bg-a1')}>
      <Container className={clsx('mt-3 pl-0')}>
        <div
          className={clsx(
            'd-flex',
            'flex-row',
            'align-items-center',
            alignTitle ? 'justify-content-center' : null
          )}
        >
          {title && (
            <h1 className={clsx('h2', 'py-2', 'mb-2', 'primary-color-a9')}>
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
                aria-label='calendar'
              />
            </Button>
          ) : null}
        </div>
        {subtitle ? (
          <div
            className={clsx(
              'd-flex',
              'flex-row',
              'align-items-center',
              alignTitle ? 'justify-content-center' : null
            )}
          >
            <p className={clsx('py-2', 'mb-2')}>{subtitle}</p>
            {cta ? (
              <Button onClick={cta.action} color='primary'>
                {cta.label}
              </Button>
            ) : null}
          </div>
        ) : null}
        {sectionInfoOpened ? (
          <SectionInfo
            title='Informazioni sulla sezione'
            body={correctSectionInfo()}
            open={sectionInfoOpened}
            setIsOpen={(value) => {
              setSectionInfoOpened(value);
            }}
          />
        ) : null}
      </Container>
    </div>
  );
};

export default memo(PageTitle);
