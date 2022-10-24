import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { FontLoader } from 'design-react-kit';
import './styles/main.scss';
import store from './redux/store';
import AppRoutes from './routes';
import ToastNotifications from './components/ToastNotification/toastNotifications';
import ModalsPortal from './components/Modals/modalsPortal';
import SkipContent from './components/SkipContent/skipContent';
import MediaQueriesProvider from './components/MediaQueriesProvider/mediaQueriesProvider';
import { i18nInit } from './utils/i18nHelper';

i18nInit();

const MyApp: React.FC = () => {
  return (
    <Provider store={store}>
      <FontLoader />
      <SkipContent />
      <MediaQueriesProvider />
      <ToastNotifications />
      <ModalsPortal.Target />
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
};

export default MyApp;
