import { useState } from "react";
import { Check, Calendar, Clock, Pencil, Trash2, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  // Fixed locale to avoid SSR/client hydration mismatch.
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toInputValue(iso: string) {
  // yyyy-MM-ddTHH:mm for <input type="datetime-local">
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

type TodoDraft = {
  title: string;
  description: string;
  due_date: string;
};

const emptyDraft: TodoDraft = { title: "", description: "", due_date: "" };

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TodoDraft>(emptyDraft);

  const toggle = (id: string) =>
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: (t.completed ? 0 : 1) as 0 | 1 } : t,
      ),
    );

  const remove = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const openCreate = () => {
    setEditingId(null);
    setDraft({
      ...emptyDraft,
      due_date: toInputValue(new Date(Date.now() + 86400000).toISOString()),
    });
    setOpen(true);
  };

  const openEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setDraft({
      title: todo.title,
      description: todo.description,
      due_date: toInputValue(todo.due_date),
    });
    setOpen(true);
  };

  const save = () => {
    if (!draft.title.trim()) return;
    const due = draft.due_date
      ? new Date(draft.due_date).toISOString()
      : new Date().toISOString();

    if (editingId) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, title: draft.title, description: draft.description, due_date: due }
            : t,
        ),
      );
    } else {
      setTodos((prev) => [
        {
          id: crypto.randomUUID(),
          title: draft.title,
          description: draft.description,
          created_at: new Date().toISOString(),
          due_date: due,
          completed: 0,
        },
        ...prev,
      ]);
    }
    setOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-3 p-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            {todos.filter((t) => !t.completed).length} pending ·{" "}
            {todos.filter((t) => t.completed).length} completed
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New task
        </Button>
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
                <div className="flex items-center gap-1">
                  {overdue && <Badge variant="destructive">Overdue</Badge>}
                  {done && (
                    <Badge variant="secondary">
                      <Check className="h-3 w-3" />
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => openEdit(todo)}
                    aria-label="Edit task"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(todo.id)}
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
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

      {todos.length === 0 && (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <p className="text-sm text-muted-foreground">No tasks yet.</p>
          <Button variant="outline" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Create your first task
          </Button>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit task" : "New task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="What needs to be done?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
                placeholder="Add some details..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due">Due date</Label>
              <Input
                id="due"
                type="datetime-local"
                value={draft.due_date}
                onChange={(e) =>
                  setDraft({ ...draft, due_date: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={save} disabled={!draft.title.trim()}>
              {editingId ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
