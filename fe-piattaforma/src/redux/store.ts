import {
  applyMiddleware,
  combineReducers,
  createStore,
} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import appReducer from './features/app/appSlice';
import anagraphicReducer from './features/anagraphic/anagraphicSlice';
import citizensAreaReducer from './features/citizensArea/citizensAreaSlice';
import administrativeAreaReducer from './features/administrativeArea/administrativeAreaSlice';
import surveyReducer from './features/administrativeArea/surveys/surveysSlice';
import modalReducer from './features/modal/modalSlice';
import notificationReducer from './features/notification/notificationSlice';
import userReducer from './features/user/userSlice';
import rolesReducer from './features/roles/rolesSlice';
import forumReducer from './features/forum/forumSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

const userPersistConfig = {
  key: 'user',
  storage: storageSession,
  //whitelist: ['loginType'],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = createStore(
  combineReducers({
    app: appReducer,
    anagraphic: anagraphicReducer,
    administrativeArea: administrativeAreaReducer,
    citizensArea: citizensAreaReducer,
    modal: modalReducer,
    notification: notificationReducer,
    survey: surveyReducer,
    roles: rolesReducer,
    user: persistedUserReducer,
    forum: forumReducer,
  }),
  composeWithDevTools(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
