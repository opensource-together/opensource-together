import { useState } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import Icon from "@/shared/components/ui/icon";

import { useNotifications } from "../hooks/use-notifications.hook";
import NotificationList from "./notification-list.component";

export const NotificationPanel = () => {
  const { unreadCount, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = () => setIsOpen(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <div className="relative">
            <Icon name="bell" size="md" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-3 -right-4 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs font-medium"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between tracking-tighter">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <p
                  onClick={markAllAsRead}
                  className="cursor-pointer rounded-full bg-black/3 px-2 py-1 text-xs text-black/80"
                >
                  Marquer tout comme lu
                </p>
              )}
            </div>
          </div>
        </div>
        <NotificationList onNotificationClick={handleNotificationClick} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
