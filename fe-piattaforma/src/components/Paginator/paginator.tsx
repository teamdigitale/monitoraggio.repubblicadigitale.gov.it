import React, { useEffect, useState } from 'react';
import { Icon, Pager, PagerItem, PagerLink } from 'design-react-kit';
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
}

const calcPages = (total: number) => total;
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

  const handleOnChange = (newActive: number) => {
    setActive(newActive);
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
          >
            <Icon
              icon='it-chevron-left'
              aria-hidden
              aria-label='Pagina precedente'
            />
          </PagerLink>
        </PagerItem>
      ) : null}
      {[...Array(pages).keys()].map((page) => (
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
      {withArrows ? (
        <PagerItem disabled={active >= pages}>
          <PagerLink
            next
            href={refID}
            onClick={() => handleOnChange(active + 1)}
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
