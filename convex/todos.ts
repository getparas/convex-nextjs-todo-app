import { zCustomMutation } from "convex-helpers/server/zod";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { NoOp } from "convex-helpers/server/customFunctions";
import {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "../lib/zod";

const zMutation = zCustomMutation(mutation, NoOp);

export const getTodos = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const todos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    return todos.reverse();
  },
});

export const createTodo = zMutation({
  args: createTodoSchema.shape,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return ctx.db.insert("todos", {
      title: args.title,
      completed: false,
      userId,
    });
  },
});

export const updateTodo = zMutation({
  args: updateTodoSchema.shape,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify the todo belongs to the user before updating
    const existingTodo = await ctx.db.get(args.id);
    if (!existingTodo) {
      throw new Error("Todo not found");
    }
    if (existingTodo.userId !== userId) {
      throw new Error("Unauthorized - this todo belongs to another user");
    }

    return ctx.db.patch(args.id, {
      title: args.title,
      completed: args.completed,
    });
  },
});

export const deleteTodo = zMutation({
  args: deleteTodoSchema.shape,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const existingTodo = await ctx.db.get(args.id);
    if (!existingTodo) {
      throw new Error("Todo not found");
    }
    if (existingTodo.userId !== userId) {
      throw new Error("Unauthorized - this todo belongs to another user");
    }
    return ctx.db.delete(args.id);
  },
});
