import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { updateTodoSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodIssue } from "zod";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Form } from "../ui/form";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Trash2Icon } from "lucide-react";

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
      form.setError("title", { message: "Failed to update todo" });
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      resetFormToInitialState();
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

  const handleBlur = () => {
    const currentTitle = form.getValues("title");
    if (!currentTitle.trim()) {
      resetFormToInitialState();
    }
    if (!form.formState.errors.title) {
      setIsEditing(false);
    }
  };

  const getContainerClassName = () => {
    return cn(
      "group flex items-center gap-3 p-4 rounded-lg border transition-colors",
      isEditing
        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
        : "border-border hover:border-primary/20 hover:bg-primary/5",
      form.formState.errors.title &&
        "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20"
    );
  };

  const getTitleClassName = () => {
    return cn(
      "font-medium text-sm group-hover:text-primary transition-colors",
      isChecked && "line-through text-muted-foreground",
      !isChecked && "cursor-pointer",
      form.formState.errors.title && "text-red-500"
    );
  };

  return (
    <Form {...form}>
      <div className={getContainerClassName()}>
        <Checkbox
          checked={isChecked}
          onCheckedChange={handleToggle}
          className="h-5 w-5 border-2 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />

        <div className="flex-1">
          {isEditing ? (
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <form
                      onSubmit={form.handleSubmit(handleUpdate)}
                      onBlur={handleBlur}
                    >
                      <input
                        {...field}
                        type="text"
                        autoFocus
                        placeholder="Press Enter to save, Esc to cancel..."
                        className="w-full bg-transparent border-none outline-none text-sm focus:ring-0 focus-visible:ring-0 focus-visible:outline-none text-primary font-medium shadow-none p-0"
                        onKeyDown={handleInputKeyDown}
                      />
                    </form>
                  </FormControl>
                </FormItem>
              )}
            />
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
        {form.formState.errors.title && (
          <span className="text-red-500 text-xs font-bold">
            {form.formState.errors.title.message}
          </span>
        )}
        <Button
          onClick={handleDelete}
          variant="secondary"
          size="icon"
          className="hover:bg-destructive group/button transition-colors"
        >
          <Trash2Icon className="text-destructive/40 group-hover/button:text-destructive-foreground" />
        </Button>
      </div>
    </Form>
  );
}
