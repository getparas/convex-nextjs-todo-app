"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import TodoItem from "./todo-item";

export default function TodoList() {
  const todos = useQuery(api.todos.getTodos);

  if (todos === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="size-8 border-4 border-primary/80 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-2">
        <div className="text-xl font-semibold text-muted-foreground">
          No tasks yet
        </div>
        <p className="text-sm text-muted-foreground">
          Add some tasks to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos?.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </div>
  );
}
