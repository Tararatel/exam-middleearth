import { createSlice } from '@reduxjs/toolkit';
import type { PointsState } from '../types/routeBuilderType';

const initialState: PointsState = {
  predefinedPoints: [],
  userRoute: [],
  loading: false,
  error: null,
  result: null,
  animating: false,
};

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default pointsSlice.reducer;
