import { z } from 'zod';

export const pointSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().optional(),
});

export const resultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type PredefinedPoints = z.infer<typeof pointSchema>;

export type UserRoute = Omit<PredefinedPoints, 'id'>;

export type RouteState = {
  userRoute: UserRoute[];
  result: { success: boolean; message: string } | null;
  animating: boolean;
};

export type PointsState = {
  predefinedPoints: PredefinedPoints[];
  loading: boolean;
  error: string | null;
} & RouteState;

