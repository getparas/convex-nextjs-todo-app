"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import TodoItem from "./todo-item";
import { CheckCircle2, Clock, Trophy } from "lucide-react";

export default function TodoList() {
  const todos = useQuery(api.todos.getTodos);

  if (todos === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 border-4 border-black animate-spin mb-6">
          <div className="w-full h-full bg-black"></div>
        </div>
        <p className="text-xl font-black text-black uppercase tracking-wide">
          LOADING TASKS...
        </p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-secondary border-4 border-black brutalist-shadow-lg mx-auto mb-8 flex items-center justify-center">
          <Trophy className="w-12 h-12 text-black" />
        </div>
        <h3 className="text-3xl font-black text-black mb-4 uppercase tracking-wide">
          NO TASKS YET
        </h3>
        <p className="text-lg font-bold text-muted uppercase tracking-wide">
          ADD YOUR FIRST TASK ABOVE
        </p>
      </div>
    );
  }

  const completedTodos = todos.filter((todo) => todo.completed);
  const incompleteTodos = todos.filter((todo) => !todo.completed);

  return (
    <div className="space-y-8">
      {/* Active Tasks */}
      {incompleteTodos.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-6 p-4 bg-secondary border-2 border-black">
            <Clock className="w-6 h-6 text-black" />
            <h3 className="text-xl font-black text-black uppercase tracking-wide">
              ACTIVE TASKS ({incompleteTodos.length})
            </h3>
          </div>
          <div className="space-y-8">
            {incompleteTodos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTodos.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-6 p-4 bg-muted border-2 border-black">
            <CheckCircle2 className="w-6 h-6 text-black" />
            <h3 className="text-xl font-black text-black uppercase tracking-wide">
              COMPLETED ({completedTodos.length})
            </h3>
          </div>
          <div className="space-y-4">
            {completedTodos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
