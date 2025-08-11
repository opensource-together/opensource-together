import Icon from "@/shared/components/ui/icon";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { useNotifications } from "../hooks/use-notifications.hook";
import NotificationItem from "./notification-panel.component";

export default function NotificationList() {
  const { notifications, isLoading, error } = useNotifications();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-gray-100 p-3 last:border-b-0">
            <div className="flex items-start gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Icon name="cross" size="sm" variant="gray" className="mx-auto mb-2" />
        <p className="text-sm">Erreur lors du chargement des notifications</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Icon name="bell" size="md" variant="gray" className="mx-auto mb-2" />
        <p className="text-sm">Aucune notification</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification, index) => {
        const key = notification.id || `notification-${index}`;

        return <NotificationItem key={key} notification={notification} />;
      })}
    </div>
  );
}
