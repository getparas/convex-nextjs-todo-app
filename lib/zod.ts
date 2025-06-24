import { z } from "zod";
import { zid } from "convex-helpers/server/zod";

export const createTodoSchema = z.object({
  title: z.string().min(3, "Todo must contain at least 3 characters"),
  completed: z.boolean().default(false),
});

export const updateTodoSchema = z.object({
  // INFO: zid does not do table name validation, it is just going to check if the id is a string.
  id: zid("todos"),
  title: z.string().min(3, "Todo must contain at least 3 characters"),
  completed: z.boolean(),
});

export const deleteTodoSchema = z.object({
  id: zid("todos"),
});
