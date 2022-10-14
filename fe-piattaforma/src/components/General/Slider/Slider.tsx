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
}

const Slider = ({ children }: SliderPropsI) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const onScroll = () => {
    const container = document.querySelector('.slides');
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
    const container = document.querySelector('.slides');
    // const nextSlide = document.querySelector(`slide-${i}`);
    if (container) {
      container.scrollLeft += (i - currentSlide) * container.clientWidth;
    }

    // setCurrentSlide(i);
  };

  return (
    <div className='slider'>
      {currentSlide > 0 && (
        <Icon
          onClick={() => scrollTo(currentSlide - 1)}
          icon='it-chevron-left'
          className='icon icon-light arrow left'
        />
      )}
      {currentSlide < children.length - 1 && (
        <Icon
          onClick={() => scrollTo(currentSlide + 1)}
          icon='it-chevron-right'
          className='icon icon-light arrow right'
        />
      )}
      <div className='slides mb-3' onScroll={onScroll}>
        {children.map((slide, i) => (
          <div key={i} id={`slide-${i}`} className='slide'>
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
        ></button>
      ))}
    </div>
  );
};

export default Slider;
