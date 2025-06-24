import CreateTodo from "@/components/todos/create-todo";
import TodoList from "@/components/todos/todo-list";
import { CheckSquare, Plus, Target } from "lucide-react";

export default function Todos() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-black border-4 border-black brutalist-shadow-xl mb-8">
            <Target className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl sm:text-7xl font-black text-black mb-6 tracking-tight">
            YOUR TASKS
          </h1>
          <p className="text-2xl font-bold text-muted uppercase tracking-wide max-w-2xl mx-auto">
            ORGANIZE • EXECUTE • DOMINATE
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Create Todo Section */}
          <div className="bg-white border-4 border-black brutalist-shadow-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black border-2 border-black flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-black uppercase tracking-wide">
                ADD NEW TASK
              </h2>
            </div>
            <CreateTodo />
          </div>

          {/* Todo List Section */}
          <div className="bg-white border-4 border-black brutalist-shadow-xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-black border-2 border-black flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-black uppercase tracking-wide">
                TASK LIST
              </h2>
            </div>
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
}
