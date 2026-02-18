import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { FontLoader } from 'design-react-kit';
import './styles/main.scss';
import store, {persistor} from './redux/store';
import AppRoutes from './routes';
import ToastNotifications from './components/ToastNotification/toastNotifications';
import ModalsPortal from './components/Modals/modalsPortal';
import SkipContent from './components/SkipContent/skipContent';
import MediaQueriesProvider from './components/MediaQueriesProvider/mediaQueriesProvider';
import { i18nInit } from './utils/i18nHelper';
import UsersAnagraphic from './components/UsersAnagraphic/usersAnagraphic';
import { PersistGate } from 'redux-persist/integration/react';
i18nInit();

const MyApp: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <FontLoader />
      <SkipContent />
      <MediaQueriesProvider />
      <ToastNotifications />
      <ModalsPortal.Target />
      <UsersAnagraphic />
      <Router>
        <AppRoutes />
      </Router>
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
