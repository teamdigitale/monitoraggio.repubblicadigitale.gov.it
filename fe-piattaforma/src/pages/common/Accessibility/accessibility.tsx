import { Container } from 'design-react-kit';
import React from 'react';
import { InfoPanel } from '../../../components';
import PageTitle from '../../../components/PageTitle/pageTitle';
import {
  accessibilityBody,
  accessibilitySubtitle,
} from '../../../components/SectionInfo/bodies';

const Accessibility = () => {
  return (
    <Container>
      <PageTitle
        title='Accessibilità'
        innerHTML
        HTMLsubtitle={accessibilitySubtitle}
      />
      <InfoPanel body={accessibilityBody} HTMLlist accessibilityPage />
    </Container>
  );
};

export default Accessibility;
