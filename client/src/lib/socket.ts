import { create } from 'zustand';
import type { TodoEvent } from '@shared/schema';

interface SocketStore {
  socket: WebSocket | null;
  connect: () => void;
  disconnect: () => void;
  onMessage: (handler: (event: TodoEvent) => void) => void;
}

export const useSocket = create<SocketStore>((set, get) => ({
  socket: null,
  connect: () => {
    if (get().socket?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    
    set({ socket });
  },
  disconnect: () => {
    get().socket?.close();
    set({ socket: null });
  },
  onMessage: (handler) => {
    const socket = get().socket;
    if (!socket) return;

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data) as TodoEvent;
      handler(data);
    });
  }
}));
