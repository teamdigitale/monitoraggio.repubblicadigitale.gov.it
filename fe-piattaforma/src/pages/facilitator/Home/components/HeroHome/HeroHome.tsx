import React, { memo } from 'react';
import { Hero, HeroBackground, HeroBody, HeroTitle } from 'design-react-kit';
import heroHomeBackgroundImg from '../../../../../../public/assets/img/hero-home-background.png';

const HeroHome = () => {
  return (
    <Hero overlay='dark' small>
      <HeroBackground
        src={heroHomeBackgroundImg}
        title='image title'
        alt='imagealt'
      />
      <HeroBody>
        <HeroTitle
          tag='h2'
          className='text-white'
          role='heading'
          aria-level={1}
        >
          {'ti diamo il benvenuto su Facilita'.toUpperCase()}
        </HeroTitle>
        <p className='d-lg-block mt-5'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at
          elementum risus. Praesent vitae ullamcorper elit. Nunc congue
          consectetur mi tempor egestas.
        </p>
      </HeroBody>
    </Hero>
  );
};

export default memo(HeroHome);
