import { Container } from 'design-react-kit';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { InfoPanel } from '../../../components';
import PageTitle from '../../../components/PageTitle/pageTitle';
import {
  accessibilityBody,
  accessibilitySubtitle,
} from '../../../components/SectionInfo/bodies';
import { hideBreadCrumb } from '../../../redux/features/app/appSlice';

const Accessibility = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hideBreadCrumb());
  },[]);

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
