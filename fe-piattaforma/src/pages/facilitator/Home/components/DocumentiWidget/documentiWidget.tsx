import clsx from 'clsx';
import { Button } from 'design-react-kit';
import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CardDocument from '../../../../../components/CardDocument/cardDocument';
import { selectDevice } from '../../../../../redux/features/app/appSlice';
import { useAppSelector } from '../../../../../redux/hooks';
import '../../../../../pages/facilitator/Home/components/BachecaDigitaleWidget/bachecaDigitaleWidget.scss';
import { useNavigate } from 'react-router-dom';
import { selectDocsList } from '../../../../../redux/features/forum/forumSlice';
import { GetItemsList } from '../../../../../redux/features/forum/forumThunk';
// import { DocumentCardMock } from '../../../Documents/documents';
/*
const DocumentsMock = [
  DocumentCardMock,
  DocumentCardMock,
  DocumentCardMock,
  DocumentCardMock,
];
*/
const DocumentsWidget = () => {
  const dispatch = useDispatch();
  const docsList = useAppSelector(selectDocsList);
  const device = useAppSelector(selectDevice);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(GetItemsList('document'));
  }, []);
  const navigateTo = () => {
    navigate('/documenti');
  };

  return (
    <div
      className={clsx('d-flex', 'py-5', !device.mediaIsDesktop && 'flex-wrap')}
    >
      <div className={clsx(device.mediaIsDesktop ? 'col-4' : 'col-12')}>
        <h2 className='h3 text-primary mt-3'>Documenti</h2>
        {!device.mediaIsDesktop ? (
          <>
            <div className='title-border-box my-3'></div>
            <p className='text-primary pb-3'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              ipsum velit, tempor at luctus quis.
            </p>
          </>
        ) : (
          <div>
            <p className='text-primary py-3'>
              <b>Lorem ipsum dolor</b> sit amet, consectetur adipiscing elit.
              Nullam ipsum velit, tempor at luctus quis, congue eget justo.
              Quisque auctor massa non dapibus varius.
            </p>
            <p
              className={clsx(
                'text-primary',
                'py-3',
                !device.mediaIsPhone ? 'mb-5' : 'mb-3'
              )}
            >
              Donec rutrum <b>ipsum in vestibulum tempus</b>. Quisque ac
              lobortis mi. Mauris dapibus rhoncus luctus. Mauris sit amet
              pretium nibh, dictum interdum purus.
            </p>
            <Button color='primary' onClick={navigateTo}>
              Accedi alla sezione
            </Button>
          </div>
        )}
      </div>
      <div className={clsx(device.mediaIsDesktop ? 'col-8' : 'col-12')}>
        <div className='container row'>
          {docsList?.length
            ? docsList.map((documentsElement, i) => (
                <div
                  key={i}
                  className={clsx(
                    'col-12',
                    'col-md-6',
                    'col-lg-6',
                    'my-2',
                    'align-cards'
                  )}
                >
                  <CardDocument {...documentsElement} isHome />
                </div>
              ))
            : null}
        </div>
      </div>
      {!device.mediaIsDesktop && (
        <div className='d-flex justify-content-center w-100'>
          <div className='d-flex flex-column align-item-center'>
            <div className='slider pb-4 pl-4'>
              <a href='#slide-1'> </a>
              <a href='#slide-2'> </a>
              <a href='#slide-3'> </a>
              <a href='#slide-4'> </a>
            </div>
            <Button color='primary' onClick={navigateTo}>
              Accedi alla sezione
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(DocumentsWidget);
