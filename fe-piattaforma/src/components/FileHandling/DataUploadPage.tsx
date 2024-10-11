import React, { useCallback, useRef, useState, useEffect } from 'react';
import CsvInstructions from './CsvInstructions';
import ActivityReportTable from '../ActivityReportTable/ActivityReportTable';
import { DataUploadContext } from '../../contexts/DataUploadContext';
import CSVFileHandler from './CSVFileHandler/CSVFileHandler';
import { ElaboratoCsvRequest } from '../../models/ElaboratoCsvRequest.model';
import { useAppSelector } from '../../redux/hooks';
import { selectProfile } from '../../redux/features/user/userSlice';
import { GetItemDetail } from '../../redux/features/forum/forumThunk';
import { useDispatch } from 'react-redux';
import { selectUser } from '../../redux/features/user/userSlice';
import { cleanDrupalFileURL } from '../../utils/common';
import { ManageItemEvent, ActionTracker } from '../../redux/features/forum/forumThunk';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Icon } from 'design-react-kit';


interface GuidaOperativaI {
  external_link: string
  attachment: string,
  category_label: string,
  category: string
}

export default function DataUploadPage() {
  const searchRef = useRef<{ search: () => void }>(null);
  const { codiceRuolo: userRole } = useAppSelector(selectProfile) || {};
  const [elaboratedCSV, setElaboratedCSV] = useState<ElaboratoCsvRequest | undefined>(undefined);
  const [guidaOpearativa, setGuidaOperativa] = useState<GuidaOperativaI>({
    external_link: "",
    attachment: "",
    category_label: "",
    category: ""
  })

  const dispatch = useDispatch();
  const userId = useAppSelector(selectUser)?.id ?? "";
  const idGuida = '178';    // 97 per produzione, 178 per test

  const getItemDetails = async () => {
    const res = await dispatch(GetItemDetail(idGuida, userId, 'document'));
    setGuidaOperativa(res?.data?.data?.items?.[0])
  };

  const trackDownload = async () => {
    if (guidaOpearativa.attachment != "") {
      await dispatch(ManageItemEvent(idGuida, 'downloaded'));
      await dispatch(
        ActionTracker({
          target: 'tnd',
          action_type: 'VISUALIZZAZIONE-DOWNLOAD',
          event_type: 'DOCUMENTI',
          category: guidaOpearativa.category_label || guidaOpearativa.category,
        })
      );

      window.open(cleanDrupalFileURL(guidaOpearativa.attachment), '_blank');
    }
  };

  useEffect(() => {
    getItemDetails();
  }, []);

  const triggerSearch = useCallback(() => {
    if (searchRef && searchRef.current) {
      searchRef.current.search();
    }
  }, [searchRef]);

  const setParsedData = useCallback(
    (elaborato: ElaboratoCsvRequest | undefined) => {
      setElaboratedCSV(elaborato);

    },
    []
  );

  const contextValue = {
    search: triggerSearch,
    parsedData: elaboratedCSV,
    setParsedData: setParsedData,
  };

  const location = useLocation();
  const navigate = useNavigate();

  const isMonitoringPage = location.search.includes('monitoring');

  const handleButtonClick = () => {
    navigate('/report-dati/monitoraggio-caricamenti-massivi');
  };

  return (
    <DataUploadContext.Provider value={contextValue}>
      {isMonitoringPage && (
        <Button
        onClick={handleButtonClick}
        aria-label='torna indietro'
      >
        <Icon
          icon='it-chevron-left'
          color='primary'
          aria-label='torna indietro'
          aria-hidden
        />
        <span className='primary-color'>Torna a Monitoraggio</span>
      </Button>
      )}
      <div className='row my-4'>
        <div className='col'>
          <h1 className='text-primary csv-title-page-size '>
            Caricamento massivo dei dati sui servizi
          </h1>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          {userRole === 'DTD' ? (
            <ActivityReportTable ref={searchRef} />
          ) : (
            <>
              <div className='row justify-content-between align-items-center mb-5'>
                <div className='col-12 col-md-6'>
                  <CsvInstructions urlGuida={cleanDrupalFileURL(guidaOpearativa.external_link)} attachmentGuida={trackDownload} />
                </div>
                <div className='col-12 col-md-6 align-self-stretch'>
                  <CSVFileHandler />
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  <ActivityReportTable ref={searchRef} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DataUploadContext.Provider>
  );
}
