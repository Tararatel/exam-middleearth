import { configureStore } from '@reduxjs/toolkit';
import pointsReducer from '../features/routeBuilder/model/routeBuilderSlice';

export const store = configureStore({
  reducer: {
    points: pointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

