import React, { useEffect, useState } from 'react';
import { Input } from '../../../components';
import { Button, Toggle } from 'design-react-kit';
import API from '../../../utils/apiHelper';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../../redux/features/app/appSlice';

const baseFrameURL =
  'https://oceddloir7.execute-api.eu-central-1.amazonaws.com/test/anonymous-embed-sample?mode=getUrl';
// OLD'https://hnmhsi4ogf.execute-api.eu-central-1.amazonaws.com/test/anonymous-embed-sample';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(baseFrameURL);
  const [frameUrl, setFrameUrl] = useState('');
  const [mode, setMode] = useState<'url' | 'get'>('get');

  const handleUpdateFrame = () => {
    if (mode === 'get') {
      getDashboardURL();
    } else {
      setFrameUrl(inputValue);
    }
  };

  const getDashboardURL = async () => {
    try {
      dispatch(showLoader());
      const res = await API.get(inputValue);
      console.log('Dashboard getUrl', res);
      if (res?.data?.EmbedUrl) {
        //&programma=<id_programma>
        setFrameUrl(`${res.data.EmbedUrl}&locale=it-IT`);
      }
    } catch (error) {
      console.log('getDashboardURL error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    handleUpdateFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className='container dashboard-container my-5'>
      <h4>Test integrazione dashboard DWH</h4>
      <div className='col-3 mt-2 mb-5'>
        <Toggle
          label='Modalità GetURL'
          checked={mode === 'get'}
          onChange={(e) => setMode(e.target.checked ? 'get' : 'url')}
        />
      </div>
      <div className='d-inline-flex w-100'>
        <Input
          col='col-8'
          label='iFrame URL'
          name='frameUrl'
          onInputChange={(newValue = '') => setInputValue(newValue.toString())}
          type='text'
          value={inputValue}
        />
        <Button color='primary' onClick={handleUpdateFrame} size='xs'>
          Aggiorna URL
        </Button>
      </div>
      <div className='dashboard-container__frame w-100'>
        <iframe
          frameBorder='0'
          src={frameUrl}
          title='quick sight dashboard'
          height='100%'
          width='100%'
        />
      </div>
    </div>
  );
};

export default Dashboard;
