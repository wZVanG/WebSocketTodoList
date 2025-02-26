import { Todo } from '@shared/schema';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useQueryClient } from '@tanstack/react-query';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const queryClient = useQueryClient();

  const toggleComplete = async () => {
    await apiRequest('PATCH', `/api/todos/${todo.id}`, {
      completed: !todo.completed
    });
    queryClient.invalidateQueries({ queryKey: ['/api/todos'] });
  };

  const deleteTodo = async () => {
    await apiRequest('DELETE', `/api/todos/${todo.id}`);
    queryClient.invalidateQueries({ queryKey: ['/api/todos'] });
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={todo.completed}
          onCheckedChange={toggleComplete}
        />
        <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
          {todo.text}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={deleteTodo}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
