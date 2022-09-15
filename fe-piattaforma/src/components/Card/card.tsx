import React, { memo } from 'react';
import {
  Card as CardKit,
  CardProps,
  CardBody,
  CardReadMore,
  CardText,
  CardTitle,
  Icon,
  CardFooterCTA,
  Button,
} from 'design-react-kit';
import clsx from 'clsx';

interface CardI extends CardProps {
  big?: boolean;
  category?: string;
  cta?: string;
  ctaHref?: string;
  ctaOnClick?: () => void;
  img?: string;
  inline?: boolean;
  rounded?: boolean;
  small?: boolean;
  text?: string;
  withBg?: boolean;
}

const Card: React.FC<CardI> = (props) => {
  const {
    big = false,
    category,
    children,
    className,
    cta,
    ctaHref,
    ctaOnClick,
    img,
    inline = false,
    rounded = true,
    small = false,
    text,
    title,
    withBg = true,
    wrapperClassName = '',
  } = props;
  return (
    <CardKit
      spacing
      className={clsx(
        className,
        withBg && 'card-bg',
        img && 'card-img',
        rounded && 'card-rounded',
        'no-after'
      )}
      wrapperClassName={wrapperClassName}
    >
      {img ? (
        <div className='img-responsive-wrapper'>
          <div className='img-responsive img-responsive-panoramic'>
            <figure className='img-wrapper'>
              <img src={img} title='img title' alt='imagealt' />
            </figure>
          </div>
        </div>
      ) : null}
      <div
        className={clsx(
          'd-inline-flex',
          'flex-nowrap',
          'align-items-center',
          'flex-column',
          'flex-lg-row'
        )}
      >
        <CardBody className={clsx(small && 'card-small', big && 'card-big')}>
          {category ? (
            <div className='category-top primary-color-b1'>
              <Icon
                color='primary'
                icon='it-calendar'
                size='xs'
                aria-label='calendar'
              />
              <span className='pl-1'>{category}</span>
            </div>
          ) : null}
          {title ? (
            <CardTitle tag='p' className='h5'>
              {title}
            </CardTitle>
          ) : null}
          {children || text ? <CardText>{children || text}</CardText> : null}
          {!inline && cta ? (
            <CardFooterCTA className='justify-content-end'>
              {ctaHref ? (
                <CardReadMore
                  iconName='it-arrow-right'
                  href={ctaHref}
                  text={cta}
                />
              ) : null}
              {/*ctaOnClick ? <Button color='primary' onClick={ctaOnClick}>{cta}</Button> : null*/}
            </CardFooterCTA>
          ) : null}
        </CardBody>
        {inline && cta ? (
          <div
            className={clsx(
              'card-inline-container',
              'd-inline-flex',
              'justify-content-around',
              'py-3',
              'py-lg-auto'
            )}
          >
            {ctaOnClick ? (
              <Button
                className={clsx(
                  'primary-bg-a9',
                  'text-white',
                  'text-nowrap',
                  'w-100'
                )}
                onClick={ctaOnClick}
                size='xs'
              >
                {cta}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </CardKit>
  );
};

export default memo(Card);
