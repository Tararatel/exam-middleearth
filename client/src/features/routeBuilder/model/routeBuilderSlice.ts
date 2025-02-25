import { createSlice } from '@reduxjs/toolkit';
import type { PointsState } from '../types/routeBuilderType';
import type { Point } from '../types/routeBuilderType';
import { getPredefinedPoints, verifyRoute } from '../lib/routeBuilderThunks';

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
  reducers: {
    addPointToRoute: (state, action: { payload: Point }) => {
      state.userRoute.push(action.payload);
    },
    resetRoute: (state) => {
      state.userRoute = [];
      state.result = null;
      state.animating = false;
    },
    startAnimation: (state) => {
      state.animating = true;
    },
    stopAnimation: (state) => {
      state.animating = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getPredefinedPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPredefinedPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.predefinedPoints = action.payload;
      })
      .addCase(getPredefinedPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Что-то пошло не так';
      })

      .addCase(verifyRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        state.animating = true;
      })
      .addCase(verifyRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Что-то пошло не так';
      });
  },
});

export const { addPointToRoute, resetRoute, startAnimation, stopAnimation } = pointsSlice.actions;
export default pointsSlice.reducer;
