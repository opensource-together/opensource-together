import useAuth from "@/features/auth/hooks/use-auth.hook";

import { useGlobalWebSocket } from "../hooks/use-global-websocket.hook";

/**
 * WebSocketProvider who manage the websocket connection once
 */
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { wsToken } = useAuth();

  useGlobalWebSocket(wsToken);
  return <>{children}</>;
};
