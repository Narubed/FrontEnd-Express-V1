import { configureStore } from '@reduxjs/toolkit';
import loadingReducers from './loading';

export default configureStore({
  reducer: {
    loading: loadingReducers,
  },
});
