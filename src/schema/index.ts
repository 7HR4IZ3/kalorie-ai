import z from "zod";

export const stripUndefinedValues = (body: { [key: string]: any }) =>
  Object.fromEntries(
    Object.entries(body).filter(([_, value]) => value !== undefined)
  );

export const UserLogin = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const UserRegistration = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  gender: z.enum(["male", "female", "other"]),
  workout_periods: z.enum(["0-2", "3-5", "6+"]),
  tried_other_tracking_apps: z.enum(["yes", "no"]),
  height: z.number(),
  weight: z.number(),
  age: z.string().datetime(),
  goal: z.enum(["lose_weight", "gain_weight", "mantain"]),
  desited_weight: z.number(),
  goal_speed: z.number().min(0.1).max(1.5),
  current_limitation: z.array(
    z.enum([
      "consistency",
      "eating_habit",
      "support",
      "busy",
      "meal_inspiraton",
    ])
  ),
  following_a_diet: z.enum(["classic", "pescetarian", "vegan", "vegitarian"]),
  accomplishment_goal: z.array(
    z.enum(["eat_healthier", "boost_mood", "stay_motivated", "feel_better"])
  ),
});

export const UserUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  workout_periods: z.enum(["0-2", "3-5", "6+"]).optional(),
  tried_other_tracking_apps: z.enum(["yes", "no"]).optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  age: z.string().datetime().optional(),
  goal: z.enum(["lose_weight", "gain_weight", "mantain"]).optional(),
  desited_weight: z.number().optional(),
  goal_speed: z.number().min(0.1).max(1.5).optional(),
  current_limitation: z
    .array(
      z.enum([
        "consistency",
        "eating_habit",
        "support",
        "busy",
        "meal_inspiraton",
      ])
    )
    .optional(),
  following_a_diet: z
    .enum(["classic", "pescetarian", "vegan", "vegitarian"])
    .optional(),
  accomplishment_goal: z
    .array(
      z.enum(["eat_healthier", "boost_mood", "stay_motivated", "feel_better"])
    )
    .optional(),
});
