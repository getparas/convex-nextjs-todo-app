"use client";

import { api } from "@/convex/_generated/api";
import { createTodoSchema } from "@/lib/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import type { z, ZodIssue } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ConvexError } from "convex/values";
import { Input } from "../ui/input";
import { FormControl, FormMessage } from "../ui/form";
import { FormItem } from "../ui/form";
import { Form, FormField } from "../ui/form";
import { Send, AlertTriangle } from "lucide-react";

type TodoFormData = z.infer<typeof createTodoSchema>;

export default function CreateTodo() {
  const createTodo = useMutation(api.todos.createTodo);

  const form = useForm<TodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    const shouldFocusInput = !form.formState.isSubmitting;
    if (shouldFocusInput) {
      form.setFocus("title");
    }
  }, [form.formState.isSubmitting, form]);

  const getInputClassName = () => {
    const baseClasses =
      "input-brutalist h-16 px-6 text-lg placeholder:text-muted placeholder:font-medium";
    const errorClasses = "border-red-600 text-red-600";
    const defaultClasses = "border-black";

    return cn(
      baseClasses,
      form.formState.errors.title ? errorClasses : defaultClasses
    );
  };

  const handleTodoCreation = async (data: TodoFormData) => {
    try {
      await createTodo({ title: data.title, completed: false });
      form.reset();
    } catch (error) {
      handleTodoCreationError(error);
    }
  };

  const handleTodoCreationError = (error: unknown) => {
    if (error instanceof ConvexError && error.data.ZodError) {
      const zodError = error.data.ZodError as ZodIssue[];
      const titleError = zodError.find((err) => err.path.includes("title"));
      if (titleError) {
        form.setError("title", { message: titleError.message });
      }
    } else {
      form.setError("title", { message: "FAILED TO CREATE TASK" });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleTodoCreation)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    ref={field.ref}
                    type="text"
                    placeholder="WHAT NEEDS TO BE DONE?"
                    disabled={form.formState.isSubmitting}
                    className={getInputClassName()}
                  />
                  <button
                    type="submit"
                    disabled={
                      form.formState.isSubmitting || !field.value.trim()
                    }
                    className="btn-brutalist absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 mx-auto" />
                  </button>
                </div>
              </FormControl>
              {form.formState.errors.title && (
                <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border-2 border-red-600">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <FormMessage className="text-red-600 font-bold uppercase text-sm" />
                </div>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
