import {
  applyMiddleware,
  combineReducers,
  createStore,
} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import appReducer from './features/app/appSlice';
import citizensAreaReducer from './features/citizensArea/citizensAreaSlice';
import administrativeAreaReducer from './features/administrativeArea/administrativeAreaSlice';
import surveyReducer from './features/administrativeArea/surveys/surveysSlice';
import modalReducer from './features/modal/modalSlice';
import notificationReducer from './features/notification/notificationSlice';
import userReducer from './features/user/userSlice';
import rolesReducer from './features/roles/rolesSlice';
import forumReducer from './features/forum/forumSlice';

const store = createStore(
  combineReducers({
    app: appReducer,
    administrativeArea: administrativeAreaReducer,
    citizensArea: citizensAreaReducer,
    modal: modalReducer,
    notification: notificationReducer,
    survey: surveyReducer,
    roles: rolesReducer,
    user: userReducer,
    forum: forumReducer,
  }),
  composeWithDevTools(applyMiddleware(thunk))
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
