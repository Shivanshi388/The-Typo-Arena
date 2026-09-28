import { useEffect } from "react";
import {
  connectSocket,
  disconnectSocket,
  socket,
} from "../services/socket";

export default function useSocket() {
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  const emit = (event, data) => {
    socket.emit(event, data);
  };

  const on = (event, callback) => {
    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  };

  return {
    socket,
    emit,
    on,
    connected: socket.connected,
  };
}