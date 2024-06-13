import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
  } from 'react';
  import CsvInstructions from './CsvInstructions';
  import ActivityReportTable from '../ActivityReportTable/ActivityReportTable';
  import { DataUploadContext } from '../../contexts/DataUploadContext';
  import CSVFileHandler from './CSVFileHandler/CSVFileHandler';
  import { ElaboratoCsvRequest } from '../../models/ElaboratoCsvRequest.model';
  import { useAppDispatch, useAppSelector } from '../../redux/hooks';
  import { selectProfile } from '../../redux/features/user/userSlice';
  import { closeModal, openModal } from '../../redux/features/modal/modalSlice';
  import WarningModal from './WarningModal';
  import { ProjectContext } from '../../contexts/ProjectContext';
  import { useNavigate } from 'react-router-dom';
  
  export default function DataUploadPage() {
    const searchRef = useRef<{ search: () => void }>(null);
    const { codiceRuolo: userRole } = useAppSelector(selectProfile) || {};
    const [elaboratedCSV, setElaboratedCSV] = useState<
      ElaboratoCsvRequest | undefined
    >(undefined);
    const dispatch = useAppDispatch();
    const projectContext = useContext(ProjectContext);
    const navigate = useNavigate();
  
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
  
    const handleCloseModal = useCallback(() => {
      dispatch(closeModal());
    }, []);
  
    const handleNavigateOut = useCallback(() => {
      navigate('./..');
      handleCloseModal();
    }, [handleCloseModal]);
  
    const contextValue = {
      search: triggerSearch,
      parsedData: elaboratedCSV,
      setParsedData: setParsedData,
    };
  
    useEffect(() => {
      if (userRole !== 'DTD') {
        dispatch(
          openModal({
            id: 'dataUpload',
            payload: {
              title: `Avviso`,
            },
          })
        );
      }
    }, [userRole]);
  
    return (
      <DataUploadContext.Provider value={contextValue}>
        <WarningModal
          id='dataUpload'
          onClose={handleNavigateOut}
          onConfirm={handleCloseModal}
        >
          Stai aprendo come Referente del Progetto {projectContext?.nomeBreve}{' '}
          {projectContext?.nomeEnte
            ? `e per conto dell'ente ${projectContext?.nomeEnte}`
            : ''}
          . Se questo non è il progetto a cui si vuole essere associati, si prega
          di abbandonare la pagina per non incorrere in errori e problemi.
        </WarningModal>
        <div className='row my-4'>
          <div className='col'>
            <h1>Caricamento massivo dati</h1>
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
                    <CsvInstructions />
                  </div>
                  <div className='col-12 col-md-6'>
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
  