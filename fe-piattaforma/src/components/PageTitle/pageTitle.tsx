import clsx from 'clsx';
import { Button, Container, Icon } from 'design-react-kit';
import React, { memo, useState } from 'react';
import './pageTitle.scss';
import SectionInfo from '../../components/SectionInfo/sectionInfo';
import '../SectionInfo/sectionInfo.scss';
import { useLocation } from 'react-router-dom';
import { surveyBody } from '../SectionInfo/bodies';

interface BreadcrumbI {
  label?: string;
  url?: string;
}
export interface PageTitleI {
  breadcrumb?: BreadcrumbI[];
  title?: string;
  hasBackground?: boolean;
  sectionInfo?: boolean;
}

const PageTitle: React.FC<PageTitleI> = (props) => {
  const { hasBackground, title, sectionInfo } = props;

  const [sectionInfoOpened, setSectionInfoOpened] = useState<boolean>(false);
  /*  const [sectionBody, setSectionBody] = useState<string>(''); */
  const location = useLocation();

  const openSectionInfo = () => {
    console.log('open section info');
    setSectionInfoOpened(true);
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
        <div className={clsx('d-flex', 'flex-row', 'align-items-center')}>
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

        {sectionInfoOpened ? (
          <SectionInfo
            title='Informazioni sulla sezione'
            body={correctSectionInfo()}
          />
        ) : null}
      </Container>
    </div>
  );
};

export default memo(PageTitle);
