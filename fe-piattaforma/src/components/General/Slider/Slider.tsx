import clsx from 'clsx';
import { Icon } from 'design-react-kit';
import React, { useState } from 'react';
import './slider.scss';

export const formatSlides = (list: any[], slideLength: number, widgetType?: string) => {
  const slides = [];
  const slidesNumb = Math.ceil(list.length / slideLength);
  for (let i = 0; i < slidesNumb; i++) {
    const pos = i * slideLength;
    slides.push(list.slice(pos, pos + slideLength));
  }
  return slides;
};

interface SliderPropsI {
  children: JSX.Element[];
  isItemsHome?: boolean | undefined;
  cardSlider?: boolean | undefined;
  widgetType?: string;
}

const Slider = ({
  children,
  isItemsHome = false,
  cardSlider = false,
  widgetType = '',
}: SliderPropsI) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const onScroll = () => {
    const container = document.getElementById(
      `widget${widgetType ? '-' + widgetType : ''}`
    );
    const containerLeft = container?.getBoundingClientRect().left;
    const slides = container?.children;

    if (slides) {
      for (let i = 0; i < slides.length; i++) {
        if (containerLeft === slides[i].getBoundingClientRect().left)
          setCurrentSlide(i);
      }
    }
  };

  const scrollTo = (i: number) => {
    const container = document.getElementById(
      `widget${widgetType ? '-' + widgetType : ''}`
    );
    if (container) {
      container.scrollLeft = i * container.clientWidth; // Sposta direttamente al punto giusto
    }
  };

  return (
    <div className='slider'>
      {currentSlide > 0 && !isItemsHome && (
        <Icon
          aria-label='Freccia sinistra'
          onClick={() => scrollTo(currentSlide - 1)}
          icon='it-chevron-left'
          className={clsx(
            'icon',
            'icon-light',
            'arrow left',
            !isItemsHome && 'right-alignment',
            cardSlider && 'align-slider-arrow'
          )}
        />
      )}
      {currentSlide < children.length && !isItemsHome && (
        <Icon
          aria-label='Freccia Destra'
          onClick={() => scrollTo(currentSlide + 1)}
          icon='it-chevron-right'
          className={clsx(
            'icon',
            'icon-light',
            'arrow right',
            !isItemsHome && 'right-alignment',
            cardSlider && 'align-slider-arrow'
          )}
        />
      )}
      <div
        className={clsx('slides', cardSlider ? 'mb-4' : 'mb-5')}
        onScroll={onScroll}
        id={`widget${widgetType ? '-' + widgetType : ''}`}
      >
        {children.map((slide, i) => (
          <div
            key={i}
            id={`slide-${i}${widgetType ? '-' + widgetType : ''}`}
            className='slide'
          >
            {slide}
          </div>
        ))}
        {widgetType === 'news' && (
          <div
            id={`slide-final${widgetType ? '-' + widgetType : ''}`}
            className='slide final-slide'
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '250px',
              backgroundColor: '#fff',
            }}
          >
            <div>
              <h2 className='h3 no-results-found__title'>
                Per visualizzare tutti i contenuti, accedi alla sezione Bacheca
              </h2>
            </div>
          </div>
        )}
      </div>

      {[...children, ''].map((_slide, i) => (
        <button
          onClick={(e) => {
            e.preventDefault();
            scrollTo(i);
          }}
          className={currentSlide === i ? 'active' : ''}
          key={i}
          aria-label='Elementi del carosello'
        />
      ))}
    </div>
  );
};

export default Slider;