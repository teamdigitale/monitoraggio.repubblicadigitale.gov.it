import React, { useEffect, useState } from 'react';
import { Icon, Pager, PagerItem, PagerLink } from 'design-react-kit';
import Ellipsis from '/public/assets/img/ellipsis.png';
import './paginator.scss';
import clsx from 'clsx';

export interface PaginatorI {
  activePage?: number | undefined;
  ariaLabel?: string;
  center?: boolean;
  className?: string;
  onChange?: (page: number) => void;
  pageSize?: number | undefined;
  refID?: string;
  total: number;
  withArrows?: boolean;
  pageToShow?: number;
}

const calcPages = (total: number) => Math.ceil(Math.max(1, total));
//Math.ceil(Math.max(1, total) / pageSize);

const Paginator: React.FC<PaginatorI> = (props) => {
  const {
    activePage = 1,
    ariaLabel = 'paginatore',
    center = true,
    className,
    onChange,
    pageSize = 8,
    refID = '#',
    total,
    withArrows = true,
    pageToShow = 5,
  } = props;

  const [pages, setPages] = useState(calcPages(total));
  const [active, setActive] = useState(activePage);

  useEffect(() => {
    setPages(calcPages(total));
  }, [total, pageSize]);

  useEffect(() => {
    if (onChange) onChange(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    setActive(activePage);
  }, [activePage]);

  const handleOnChange = (newActive: number) => {
    setActive(newActive);
  };

  const renderPages = () => {
    if (pages > pageToShow + 2) {
      const toPage = Math.min(active + pageToShow - 1, pages) - 1;
      const fromPage = Math.max(1, toPage - pageToShow);
      return (
        <>
          <PagerItem key={0}>
            <PagerLink
              href={refID}
              aria-current={1 === active ? 'page' : undefined}
              onClick={() => handleOnChange(1)}
            >
              1
            </PagerLink>
          </PagerItem>
          {fromPage - 1 >= 1 ? (
            <PagerItem className='d-flex align-items-center'>
              <Icon
                icon={Ellipsis}
                className='ellipsis'
                aria-label='pagine nascoste'
                aria-hidden
              />
            </PagerItem>
          ) : null}
          {[...Array(pages).keys()].slice(fromPage, toPage).map((page) => (
            <PagerItem key={page}>
              <PagerLink
                href={refID}
                aria-current={page + 1 === active ? 'page' : undefined}
                onClick={() => handleOnChange(page + 1)}
              >
                {page + 1}
              </PagerLink>
            </PagerItem>
          ))}
          {pages - toPage > 1 ? (
            <PagerItem className='d-flex align-items-center'>
              <Icon
                icon={Ellipsis}
                className='ellipsis'
                aria-label='pagine nascoste'
                aria-hidden
              />
            </PagerItem>
          ) : null}
          <PagerItem key={pages}>
            <PagerLink
              href={refID}
              aria-current={pages === active ? 'page' : undefined}
              onClick={() => handleOnChange(pages)}
            >
              {pages}
            </PagerLink>
          </PagerItem>
        </>
      );
    } else {
      return [...Array(pages).keys()].map((page) => (
        <PagerItem key={page}>
          <PagerLink
            href={refID}
            aria-current={page + 1 === active ? 'page' : undefined}
            onClick={() => handleOnChange(page + 1)}
          >
            {page + 1}
          </PagerLink>
        </PagerItem>
      ));
    }
  };

  return (
    <Pager
      aria-label={ariaLabel}
      className={clsx(center && 'justify-content-center', className)}
    >
      {withArrows ? (
        <PagerItem disabled={active <= 1}>
          <PagerLink
            previous
            href={refID}
            onClick={() => handleOnChange(active - 1)}
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault();
                handleOnChange(active - 1);
              }
            }}
            tabIndex={active <= 1 ? -1 : 0}
          >
            <Icon
              icon='it-chevron-left'
              aria-hidden
              aria-label='Pagina precedente'
            />
          </PagerLink>
        </PagerItem>
      ) : null}
      {renderPages()}
      {withArrows ? (
        <PagerItem disabled={active >= pages}>
          <PagerLink
            next
            href={refID}
            onClick={() => handleOnChange(active + 1)}
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault();
                handleOnChange(active + 1);
              }
            }}
            tabIndex={active >= pages ? -1 : 0}
          >
            <Icon
              icon='it-chevron-right'
              aria-hidden
              aria-label='Pagina successiva'
            />
          </PagerLink>
        </PagerItem>
      ) : null}
    </Pager>
  );
};

export default Paginator;
