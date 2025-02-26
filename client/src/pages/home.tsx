import { AddTodo } from '@/components/add-todo';
import { TodoList } from '@/components/todo-list';

export default function Home() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Todo List
          </h1>
          <p className="text-muted-foreground">
            Add, complete, and remove todos in real-time
          </p>
        </div>
        
        <AddTodo />
        <TodoList />
      </div>
    </div>
  );
}
