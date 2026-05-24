import { createFileRoute } from "@tanstack/react-router";
import { TodoList } from "@/components/TodoList";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <TodoList />
    </div>
  );
}
