import { useState } from "react";
import { Check, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  title: string;
  description: string;
  created_at: string;
  due_date: string;
  completed: 0 | 1;
}

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Design landing page",
    description: "Create wireframes and high-fidelity mockups for the new product launch.",
    created_at: "2026-05-20T09:00:00Z",
    due_date: "2026-05-28T17:00:00Z",
    completed: 0,
  },
  {
    id: "2",
    title: "Review pull requests",
    description: "Go through pending PRs from the team and leave feedback.",
    created_at: "2026-05-22T14:30:00Z",
    due_date: "2026-05-24T18:00:00Z",
    completed: 1,
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all public endpoints with examples and response schemas.",
    created_at: "2026-05-23T10:15:00Z",
    due_date: "2026-05-30T12:00:00Z",
    completed: 0,
  },
  {
    id: "4",
    title: "Team retrospective",
    description: "Prepare notes and action items for the sprint retrospective meeting.",
    created_at: "2026-05-18T11:00:00Z",
    due_date: "2026-05-23T15:00:00Z",
    completed: 0,
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);

  const toggle = (id: string) =>
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: (t.completed ? 0 : 1) as 0 | 1 } : t,
      ),
    );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          {todos.filter((t) => !t.completed).length} pending ·{" "}
          {todos.filter((t) => t.completed).length} completed
        </p>
      </div>

      {todos.map((todo) => {
        const done = todo.completed === 1;
        const overdue = !done && new Date(todo.due_date) < new Date();

        return (
          <Card
            key={todo.id}
            className={cn(
              "flex gap-3 p-4 transition-colors",
              done && "bg-muted/40",
            )}
          >
            <Checkbox
              checked={done}
              onCheckedChange={() => toggle(todo.id)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className={cn(
                    "font-medium leading-tight",
                    done && "text-muted-foreground line-through",
                  )}
                >
                  {todo.title}
                </h3>
                {overdue && <Badge variant="destructive">Overdue</Badge>}
                {done && <Badge variant="secondary"><Check className="h-3 w-3" /></Badge>}
              </div>
              <p
                className={cn(
                  "text-sm text-muted-foreground",
                  done && "line-through",
                )}
              >
                {todo.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Created {formatDate(todo.created_at)}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    overdue && "text-destructive",
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  Due {formatDate(todo.due_date)}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
