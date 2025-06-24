"use client";

import type React from "react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { updateTodoSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z, ZodIssue } from "zod";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Form } from "../ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit3, Save, X, AlertTriangle } from "lucide-react";

type TodoFormData = z.infer<typeof updateTodoSchema>;

export default function TodoItem({ todo }: { todo: Doc<"todos"> }) {
  const [isChecked, setIsChecked] = useState(todo.completed);
  const [isEditing, setIsEditing] = useState(false);

  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const form = useForm<TodoFormData>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      id: todo._id,
      title: todo.title,
      completed: todo.completed,
    },
  });

  const handleDelete = async () => {
    await deleteTodo({ id: todo._id });
  };

  const handleUpdate = async (data: TodoFormData) => {
    try {
      await updateTodo(data);
      form.clearErrors();
      setIsEditing(false);
    } catch (error) {
      handleUpdateError(error);
    }
  };

  const handleUpdateError = (error: unknown) => {
    if (error instanceof ConvexError && error.data.ZodError) {
      const zodError = error.data.ZodError as ZodIssue[];
      const titleError = zodError.find((error) => error.path.includes("title"));
      if (titleError) {
        form.setError("title", { message: titleError.message });
      }
    } else {
      form.setError("title", { message: "FAILED TO UPDATE TASK" });
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      resetFormToInitialState();
    }
    if (e.key === "Enter") {
      form.handleSubmit(handleUpdate)();
    }
  };

  const resetFormToInitialState = () => {
    form.reset({ ...form.getValues(), title: todo.title });
    form.clearErrors();
    setIsEditing(false);
  };

  const handleToggle = async (checked: boolean) => {
    setIsChecked(checked);
    await handleUpdate({
      id: todo._id,
      title: form.getValues("title"),
      completed: checked,
    });
  };

  const getContainerClassName = () => {
    return cn(
      "card-brutalist group transition-all duration-200 p-6",
      isEditing ? "brutalist-shadow-lg" : "hover:brutalist-shadow-hover",
      form.formState.errors.title && "border-red-600",
      isChecked && "opacity-75 bg-secondary"
    );
  };

  const getTitleClassName = () => {
    return cn(
      "font-bold text-lg transition-all duration-200 uppercase tracking-wide",
      isChecked && "line-through text-muted",
      !isChecked && !isEditing && "cursor-pointer hover:text-gray-700",
      !isChecked && !isEditing && "text-black",
      form.formState.errors.title && "text-red-600"
    );
  };

  return (
    <Form {...form}>
      <div className={getContainerClassName()}>
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              checked={isChecked}
              onCheckedChange={handleToggle}
              className="h-6 w-6 border-4 border-black data-[state=checked]:bg-black data-[state=checked]:border-black transition-all duration-200"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          autoFocus
                          placeholder="ENTER TASK TITLE..."
                          className="w-full bg-white border-4 border-black p-3 text-lg font-bold focus:outline-none focus:brutalist-shadow-hover transition-all duration-200 uppercase tracking-wide"
                          onKeyDown={handleInputKeyDown}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.formState.errors.title && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-600">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600 font-bold uppercase text-sm">
                      {form.formState.errors.title.message}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={form.handleSubmit(handleUpdate)}
                    className="btn-brutalist px-4 py-2 text-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    SAVE
                  </Button>
                  <Button
                    onClick={resetFormToInitialState}
                    className="bg-white hover:bg-secondary text-black border-4 border-black brutalist-shadow-hover font-bold uppercase text-sm px-4 py-2 hover-lift"
                  >
                    <X className="w-4 h-4 mr-2" />
                    CANCEL
                  </Button>
                </div>
              </div>
            ) : (
              <span
                onClick={() => {
                  if (!isChecked) setIsEditing(true);
                }}
                className={getTitleClassName()}
              >
                {form.getValues("title")}
              </span>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex-shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {!isChecked && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-secondary text-black border-2 border-black brutalist-shadow-hover p-2"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-red-50 text-black hover:text-red-600 border-2 border-black hover:border-red-600 brutalist-shadow-hover p-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
}
