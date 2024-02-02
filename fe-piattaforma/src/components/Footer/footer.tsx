import React, { memo } from 'react';
import Logo4 from '/public/assets/img/logo-eu-pnrr-white.png';
import Logo1 from '/public/assets/img/logo-rd-white.png';
import Logo2 from '/public/assets/img/mitd-logo_tmp.png';

const Footer: React.FC = () => {
  return (
    <>
      <section className='footer_one footer_styles'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-12 col-md-12 col-md-4 col-lg-4'>
              <a
                aria-label="finanziato dall'unione europea"
                href='https://ec.europa.eu/info/index_it'
                target='_blank'
                rel='noreferrer'
              >
                <img
                  alt="finanziato dall'unione europea"
                  src={Logo4}
                  className='image_style'
                />
              </a>
            </div>
            <div className='col-sm-12 col-md-12 col-md-4 col-lg-4 d-flex-custom-footer'>
              <a
                aria-label='dipartimento per la trasformazione digitale'
                href='https://innovazione.gov.it/'
                target='_blank'
                rel='noreferrer'
              >
                <img
                  alt='dipartimento per la trasformazione digitale'
                  src={Logo2}
                  className='image_style'
                />
              </a>
            </div>
            <div className='col-sm-12 col-md-12 col-md-4 col-lg-4'>
              <a
                aria-label='repubblica digitale'
                href='https://repubblicadigitale.innovazione.gov.it/it/'
                target='_blank'
                rel='noreferrer'
                className='link_label'
              >
                <img
                  alt='repubblica digitale'
                  src={Logo1}
                  className='image_style'
                />
              </a>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-12 col-md-4 col-md-4 col-lg-4'>
              <div
                className='footer_contact_widget'
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <h6 className='title_link_footer'>Assistenza</h6>
                <p>
                  Per richiedere supporto tecnico, contattaci all'indirizzo email:<br />
                  <a
                    href='mailto:supporto-facilita@repubblicadigitale.gov.it'
                    className='link_common_assistance link_style_assistance'
                  >
                    supporto-facilita@repubblicadigitale.gov.it
                  </a>
                </p>
              </div>
            </div>
            <div className='col-sm-12 col-md-4 col-md-4 col-lg-4'>
              <div className='footer_company_widget'>
                <div
                  className='footer_contact_widget'
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <h4 className='title_link_footer'>
                    Altri siti dell'iniziativa
                  </h4>
                  <b>
                    <a
                      href='https://competenze.repubblicadigitale.gov.it'
                      className='link_common link_label'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Formazione
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='svg_style'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M19.5 4H14C13.7239 4 13.5 4.22386 13.5 4.5C13.5 4.77614 13.7239 5 14 5H18.6996L10.3307 13.3689C10.1355 13.5642 10.1355 13.8808 10.3307 14.076C10.526 14.2713 10.8426 14.2713 11.0378 14.076L19.5 5.61385V10.5C19.5 10.7761 19.7239 11 20 11C20.2761 11 20.5 10.7761 20.5 10.5V5C20.5 4.44772 20.0523 4 19.5 4ZM17.51 12.5C17.51 12.2239 17.7339 12 18.01 12C18.2784 12.0053 18.4947 12.2216 18.5 12.49V18C18.5 19.6569 17.1569 21 15.5 21H6.5C4.84315 21 3.5 19.6569 3.5 18V9C3.5 7.34315 4.84315 6 6.5 6H11.5C11.7739 6.00532 11.9947 6.22609 12 6.5C12 6.77614 11.7761 7 11.5 7H6.5C5.39543 7 4.5 7.89543 4.5 9V18C4.5 19.1046 5.39543 20 6.5 20H15.51C16.6146 20 17.51 19.1046 17.51 18V12.5Z'
                          fill='#63D6D1'
                        ></path>
                      </svg>
                    </a>
                  </b>
                  <b>
                    <a
                      href='https://repubblicadigitale.gov.it'
                      className='link_common link_label'
                      target='_blank'
                      rel='noreferrer'
                    >
                      Repubblica Digitale
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='svg_style'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M19.5 4H14C13.7239 4 13.5 4.22386 13.5 4.5C13.5 4.77614 13.7239 5 14 5H18.6996L10.3307 13.3689C10.1355 13.5642 10.1355 13.8808 10.3307 14.076C10.526 14.2713 10.8426 14.2713 11.0378 14.076L19.5 5.61385V10.5C19.5 10.7761 19.7239 11 20 11C20.2761 11 20.5 10.7761 20.5 10.5V5C20.5 4.44772 20.0523 4 19.5 4ZM17.51 12.5C17.51 12.2239 17.7339 12 18.01 12C18.2784 12.0053 18.4947 12.2216 18.5 12.49V18C18.5 19.6569 17.1569 21 15.5 21H6.5C4.84315 21 3.5 19.6569 3.5 18V9C3.5 7.34315 4.84315 6 6.5 6H11.5C11.7739 6.00532 11.9947 6.22609 12 6.5C12 6.77614 11.7761 7 11.5 7H6.5C5.39543 7 4.5 7.89543 4.5 9V18C4.5 19.1046 5.39543 20 6.5 20H15.51C16.6146 20 17.51 19.1046 17.51 18V12.5Z'
                          fill='#63D6D1'
                        ></path>
                      </svg>
                    </a>
                  </b>
                </div>
              </div>
            </div>
            <div className='col-sm-12 col-md-4 col-md-4 col-lg-4'>
              <div className='footer_apps_widget'>
                <h4></h4>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='footer_middle_area p0 section_style'>
        <div className='container'>
          <div className='row row_style'>
            <div className='col-12'>
              <a href='/informativa-privacy-e-cookie' className='link_common link_style'>
                Informativa privacy e cookie
              </a>
              <a
                href='javascript:'
                className='link_common link_style'
                target='_blank'
                rel='noreferrer'
              >
                Dichiarazione di accessibilità
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='svg_style'
                  width='21'
                  height='21'
                  viewBox='0 0 25 24'
                  fill='none'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M19.5 4H14C13.7239 4 13.5 4.22386 13.5 4.5C13.5 4.77614 13.7239 5 14 5H18.6996L10.3307 13.3689C10.1355 13.5642 10.1355 13.8808 10.3307 14.076C10.526 14.2713 10.8426 14.2713 11.0378 14.076L19.5 5.61385V10.5C19.5 10.7761 19.7239 11 20 11C20.2761 11 20.5 10.7761 20.5 10.5V5C20.5 4.44772 20.0523 4 19.5 4ZM17.51 12.5C17.51 12.2239 17.7339 12 18.01 12C18.2784 12.0053 18.4947 12.2216 18.5 12.49V18C18.5 19.6569 17.1569 21 15.5 21H6.5C4.84315 21 3.5 19.6569 3.5 18V9C3.5 7.34315 4.84315 6 6.5 6H11.5C11.7739 6.00532 11.9947 6.22609 12 6.5C12 6.77614 11.7761 7 11.5 7H6.5C5.39543 7 4.5 7.89543 4.5 9V18C4.5 19.1046 5.39543 20 6.5 20H15.51C16.6146 20 17.51 19.1046 17.51 18V12.5Z'
                    fill='#63D6D1'
                  ></path>
                </svg>
              </a>
              <a
                href='https://www.italiadomani.gov.it'
                className='link_common link_style_right'
                target='_blank'
                rel='noreferrer'
              >
                Italia domani
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='link_common link_style_right'
                  width='21'
                  height='21'
                  viewBox='0 0 25 24'
                  fill='none'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M19.5 4H14C13.7239 4 13.5 4.22386 13.5 4.5C13.5 4.77614 13.7239 5 14 5H18.6996L10.3307 13.3689C10.1355 13.5642 10.1355 13.8808 10.3307 14.076C10.526 14.2713 10.8426 14.2713 11.0378 14.076L19.5 5.61385V10.5C19.5 10.7761 19.7239 11 20 11C20.2761 11 20.5 10.7761 20.5 10.5V5C20.5 4.44772 20.0523 4 19.5 4ZM17.51 12.5C17.51 12.2239 17.7339 12 18.01 12C18.2784 12.0053 18.4947 12.2216 18.5 12.49V18C18.5 19.6569 17.1569 21 15.5 21H6.5C4.84315 21 3.5 19.6569 3.5 18V9C3.5 7.34315 4.84315 6 6.5 6H11.5C11.7739 6.00532 11.9947 6.22609 12 6.5C12 6.77614 11.7761 7 11.5 7H6.5C5.39543 7 4.5 7.89543 4.5 9V18C4.5 19.1046 5.39543 20 6.5 20H15.51C16.6146 20 17.51 19.1046 17.51 18V12.5Z'
                    fill='#63D6D1'
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default memo(Footer);
