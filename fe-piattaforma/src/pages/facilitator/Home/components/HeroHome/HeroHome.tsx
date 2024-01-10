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
          La piattaforma dedicata alle attività di facilitazione digitale:
          gestisci i servizi, monitora i risultati e interagisci con la
          community dei facilitatori.
        </p>
      </HeroBody>
    </Hero>
  );
};

export default memo(HeroHome);
