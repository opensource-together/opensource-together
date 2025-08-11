import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

import { useNotifications } from "../hooks/use-notifications.hook";

export default function NotificationBell() {
  const { unreadCount, openNotifications } = useNotifications();

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={openNotifications}
      aria-label={`Notifications (${unreadCount} non lues)`}
    >
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
  );
}
