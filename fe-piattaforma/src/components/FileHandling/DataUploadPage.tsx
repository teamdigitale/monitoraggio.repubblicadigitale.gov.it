import React, { useCallback, useEffect, useRef, useState } from 'react';
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


export default function DataUploadPage() {
  const searchRef = useRef<{ search: () => void }>(null);
  const { codiceRuolo: userRole } = useAppSelector(selectProfile) || {};
  const [elaboratedCSV, setElaboratedCSV] = useState<
    ElaboratoCsvRequest | undefined
  >(undefined);

  const [urlGuida, setUrlGuida] = useState(null)
  const dispatch = useDispatch();
  const userId = useAppSelector(selectUser)?.id ?? "";
  const idGuida = '178';
  
  const getItemDetails = async () => {
   
      const res = await dispatch(GetItemDetail(idGuida, userId, 'document'));
      setUrlGuida(res?.data?.data?.items?.[0]?.external_link);
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

  return (
    <DataUploadContext.Provider value={contextValue}>
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
                  <CsvInstructions urlGuida={urlGuida || ''} />
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
