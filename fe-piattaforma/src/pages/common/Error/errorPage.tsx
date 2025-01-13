import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Logo4 from '/public/assets/img/logo-eu-pnrr-white.png';
import Logo1 from '/public/assets/img/logo-rd-white.png';
import Logo2 from '/public/assets/img/mitd-logo_tmp.png';
import HeaderLogo1 from '/public/assets/img/header-logo-01.png';
import HeaderLogo2 from '/public/assets/img/header-logo-02.png';
import './errorPage.css'
import {
  defaultErrorMessage,
  getErrorMessage
} from '../../../utils/notifictionHelper';
import { LogoutRedirect } from '../../../redux/features/user/userThunk';
import { Card, Icon } from 'design-react-kit';
import { ErrorPageProps } from './interface/ErrorPage';
import { Footer } from '../../../components';
import Header from '../../../components/Header/header';

export default function ErrorPage({showIcon,genericIcon}: ErrorPageProps)  {
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage);
  const [errorTitle, setErrorTitle] = useState("");  

  const dispatch = useDispatch();
  const { errorCode = 'empty' } = useParams();

  useEffect(() => {
    setTimeout(() => {
      dispatch(LogoutRedirect());
    }, 55000);
  }, [dispatch]);

  const handleGetErrorMessage = useCallback(() => {
    getErrorMessage({ errorCode })
      .then(error => {
        if (error?.message) {
          setErrorMessage(error.message);
        }
        if (error?.title) {
          setErrorTitle(error.title);
        }
      })
      .catch(err => {
        setErrorMessage(err.message);
        setErrorTitle(err.title);
      });
  }, [errorCode, setErrorMessage, setErrorTitle]);


  useEffect(() => {
    handleGetErrorMessage();
  }, [errorCode, handleGetErrorMessage]);

  return (
    <div className="container-fluid d-flex flex-column min-vh-100">
      <Header isHeaderFull={true} />
      <main className="card-container">
        <div className='error-message-container shadow-1'>
          <Card spacing className="card-bg text-center d-flex align-items-center p-4">
              {showIcon && (
                <div
                  className="rounded-circle primary-bg-a7 auth-container__top-icon-container d-flex align-items-center justify-content-center mb-3">
                  {genericIcon && (
                    <Icon icon={genericIcon} color='white' size='sm' />
                  )
                  }
                </div>
              )}
            <div className="h2 font-weight-semibold text-primary text-center text-wrap">
              {errorTitle}
            </div>
            <p className="h5 font-weight-semibold text-secondary ">{errorMessage}</p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
