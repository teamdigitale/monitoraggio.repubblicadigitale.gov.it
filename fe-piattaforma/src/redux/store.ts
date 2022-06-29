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
import programReducer from './features/administrativeArea/programs/programsSlice';
import projectReducer from './features/administrativeArea/projects/projectsSlice';

const store = createStore(
  combineReducers({
    app: appReducer,
    administrativeArea: administrativeAreaReducer,
    citizensArea: citizensAreaReducer,
    modal: modalReducer,
    notification: notificationReducer,
    survey: surveyReducer,
    program: programReducer,
    roles: rolesReducer,
    user: userReducer,
    project: projectReducer,
  }),
  composeWithDevTools(applyMiddleware(thunk))
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
