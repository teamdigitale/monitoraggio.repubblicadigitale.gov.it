import clsx from 'clsx';
import { Icon } from 'design-react-kit';
import React, { useState } from 'react';
import './slider.scss';

export const formatSlides = (list: any[], slideLength: number) => {
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
    // const nextSlide = document.querySelector(`slide-${i}`);
    if (container) {
      container.scrollLeft += (i - currentSlide) * container.clientWidth;
    }
    // setCurrentSlide(i);
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
      {currentSlide < children.length - 1 && !isItemsHome && (
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
      </div>

      {children.map((_slide, i) => (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
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
