import React, { useEffect, useState } from 'react';
import { Input } from '../../../components';
import { Button } from 'design-react-kit';
import API from '../../../utils/apiHelper';

const baseFrameURL =
  'https://oceddloir7.execute-api.eu-central-1.amazonaws.com/test/anonymous-embed-sample?mode=getUrl';
// OLD'https://hnmhsi4ogf.execute-api.eu-central-1.amazonaws.com/test/anonymous-embed-sample';

const Dashboard = () => {
  const [inputValue, setInputValue] = useState(baseFrameURL);
  const [frameUrl, setFrameUrl] = useState('');

  const handleUpdateFrame = () => {
    getDashboardURL();
  };

  const getDashboardURL = async () => {
    const res = await API.get(inputValue);
    console.log('Dashboard getUrl', res);
    if (res?.data?.EmbedUrl) {
      setFrameUrl(`${res.data.EmbedUrl}&locale=it-IT&programma=<id_programma>`);
    }
  };

  useEffect(() => {
    getDashboardURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='container dashboard-container my-5'>
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
