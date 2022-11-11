import { configureStore } from '@reduxjs/toolkit';
import loadingReducers from './loading';
import sessionReducers from './session';

export default configureStore({
  reducer: {
    loading: loadingReducers,
    session: sessionReducers,
  },
});
