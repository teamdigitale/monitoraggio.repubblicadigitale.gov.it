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
      <div className="row background-primary-medium first-header">
        <div className="col-md-12 d-flex align-items-center mx-2">
          <div className="white-text fw-400 fs-18 titillium-web-regular first-header-text">Dipartimento per la
            trasformazione digitale
          </div>
        </div>
      </div>
      <div className="row background-primary-light second-header">
        <div className="col-md-12 d-flex align-items-center">
          <img src={HeaderLogo1} className="img-fluid first-logo" alt="" />
          <img src={HeaderLogo2} className="img-fluid second-logo" alt="" />
          <div className="second-header-titles-container titillium-web-regular white-text">
            <div className="row">
              <div className="fw-700 fs-32 second-header-title"> Formazione per la
                facilitazione digitale
              </div>
            </div>
            <div className="row">
              <div className="second-header-sub-title fw-400 fs-16">
                Piattaforma di e-learning per facilitatori e volontari
              </div>
            </div>
          </div>
        </div>
      </div>
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
      <footer className="footer background-primary-dark ">
        <div className="footer-container footer text-center d-flex">
          <div className="row justify-content-center align-items-center w-100">
            <div className="footer-div col-md-3 col-sm-12 mt-2 d-flex mt-4">
              <a href="https://commission.europa.eu/index_it" target="_blank" rel="noreferrer">
                <img src={Logo4} className="img-fluid first-footer-logo"
                     alt="first-footer-logo" />
              </a>
            </div>
            <div className="footer-div col-sm-12 col-md-6 d-flex mt-4">
              <div className="footer-div d-flex">
                <a href="https://innovazione.gov.it/" target="_blank" style={{ maxWidth: 'max-content' }}
                   rel="noreferrer">
                  <img src={Logo2} className="img-fluid second-footer-logo-02"
                       alt="second-footer-logo-02" />
                </a>
              </div>
            </div>
            <div className="footer-div col-md-3 col-sm-12 mt-2 d-flex mt-4">
              <a href="https://repubblicadigitale.gov.it/portale/" target="_blank" rel="noreferrer">
                <img src={Logo1} className="img-fluid third-footer-logo mb-3"
                     alt="third-footer-logo" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
