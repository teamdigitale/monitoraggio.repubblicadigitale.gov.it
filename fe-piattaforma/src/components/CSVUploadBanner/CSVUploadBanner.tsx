import React from 'react';
import fileUploadImg from './../../../public/assets/img/file_upload.png';
import { Button } from 'design-react-kit';
import "./csv-uploader-banner.scss";

export default function CSVUploadBanner(props: {
  onPrimaryButtonClick: () => void;
}) {
  return (
    <div className='row w-100 my-4'>
      <div className='col-12'>
        <div className='card-wrapper card-space'>
          <div className='card card-bg card-big'>
            <div className='card-body'>
              <div className='row'>
                <div className='col-12 col-xs-3 col-md-4 col-lg-2'>
                  <img
                    src={fileUploadImg}
                    alt='descrizione immagine'
                    aria-hidden='true'
                  />
                </div>
                <div className='col-12 col-xs-9 col-md-8 col-lg-10 d-flex align-items-center'>
                  <div className='row w-100'>
                    <div className='col-xs-12 col-md-6'>
                      <h4 className='card-title font-bold text-primary mb-0'>
                        Caricamento Massivo dati
                      </h4>
                      <p className='card-text'>
                        Carica + vedi registro
                      </p>
                    </div>
                    <div className='col-xs-12 col-md-6 d-flex align-items-center justify-content-end'>
                      <Button
                        onClick={props.onPrimaryButtonClick}
                        type='button'
                        className='btn btn-outline-primary my-4'
                      >
                        Vai al tool
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
