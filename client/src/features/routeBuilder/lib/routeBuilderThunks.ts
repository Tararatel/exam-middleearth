import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../shared/api';
import type { Point } from '../types/routeBuilderType';
import { pointSchema, resultSchema } from '../types/routeBuilderType';

export const getPredefinedPoints = createAsyncThunk<Point[], undefined, { rejectValue: string }>(
  'points/getPredefinedPoints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/points');
      return pointSchema.array().parse(response.data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch predefined points',
      );
    }
  },
);

export const verifyRoute = createAsyncThunk<
  { success: boolean; message: string },
  Point[],
  { rejectValue: string }
>('points/verifyRoute', async (route, { rejectWithValue }) => {
  try {
    const response = await axios.post('/check-route', { route });

    return resultSchema.parse(response.data);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to verify route');
  }
});
