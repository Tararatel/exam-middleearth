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

export type Point = z.infer<typeof pointSchema>;

export type RouteState = {
  userRoute: Point[];
  result: { success: boolean; message: string } | null;
  animating: boolean;
};

export type PointsState = {
  predefinedPoints: Point[];
  loading: boolean;
  error: string | null;
} & RouteState;

