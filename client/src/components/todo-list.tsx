import { useQuery } from '@tanstack/react-query';
import { TodoItem } from './todo-item';
import type { Todo } from '@shared/schema';
import { useSocket } from '@/lib/socket';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function TodoList() {
  const socket = useSocket();
  const queryClient = useQueryClient();
  
  const { data: todos, isLoading } = useQuery<Todo[]>({ 
    queryKey: ['/api/todos']
  });

  useEffect(() => {
    socket.connect();
    socket.onMessage(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/todos'] });
    });
    return () => socket.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[60px] bg-muted animate-pulse rounded-md"/>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      {todos?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {todos?.length === 0 && (
        <div className="p-4 text-center text-muted-foreground">
          No todos yet. Add one above!
        </div>
      )}
    </div>
  );
}
