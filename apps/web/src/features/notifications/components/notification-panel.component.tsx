import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import { Avatar } from "@/shared/components/ui/avatar";
import Icon from "@/shared/components/ui/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

import { useNotifications } from "../hooks/use-notifications.hook";
import { Notification } from "../types/notification.type";
import NotificationList from "./notification-list.component";

export default function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const isRead = !!notification.readAt;

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case "project.role.application.created":
        return "Nouvelle candidature pour votre projet";
      case "project.role.application.accepted":
        return "Votre candidature a été acceptée";
      case "project.role.application.rejected":
        return "Votre candidature a été refusée";
      case "project.created":
        return "Nouveau projet créé";
      case "project.updated":
        return "Projet mis à jour";
      case "project.deleted":
        return "Projet supprimé";
      case "message.received":
        return "Nouveau message reçu";
      default:
        return notification.object || "Nouvelle notification";
    }
  };

  const getNotificationDetails = (notification: Notification) => {
    const payload = notification.payload as any;

    switch (notification.type) {
      case "project.role.application.created":
        if (payload?.project && payload?.projectRole && payload?.userProfile) {
          return {
            title: `a candidaté à votre rôle`,
            message: payload.message,
            user: payload.userProfile.name,
            project: payload.project.title,
            role: payload.projectRole.title,
            userProfile: payload.userProfile,
          };
        }
        break;
      case "project.role.application.accepted":
        if (payload?.project && payload?.projectRole) {
          return {
            title: "Votre candidature a été acceptée",
            message: `Votre candidature pour ${payload.projectRole.title} a été acceptée`,
            project: payload.project.title,
            role: payload.projectRole.title,
          };
        }
        break;
      case "project.role.application.rejected":
        if (payload?.project && payload?.projectRole) {
          return {
            title: "Votre candidature a été refusée",
            message: `Votre candidature pour ${payload.projectRole.title} a été refusée`,
            project: payload.project.title,
            role: payload.projectRole.title,
          };
        }
        break;
      default:
        return {
          title: notification.object,
          subtitle: "",
          message: "",
        };
    }

    return {
      title: notification.object,
      message: "",
    };
  };

  const details = getNotificationDetails(notification);

  return (
    <div
      className={`cursor-pointer rounded-xl border-b border-gray-100 p-4 transition-colors last:border-b-0 hover:bg-gray-50 ${
        isRead ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isRead ? "bg-gray-200" : "bg-blue-100"
            }`}
          >
            {details.userProfile?.avatarUrl ? (
              <Avatar
                src={details.userProfile.avatarUrl}
                name={details.userProfile.name}
                alt={details.userProfile.name}
                className="h-full w-full"
              />
            ) : (
              <Icon
                name="bell"
                size="sm"
                variant={isRead ? "gray" : "default"}
              />
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  isRead ? "text-gray-600" : "text-gray-900"
                }`}
              >
                {details.user} {details.title}
              </p>

              {details.message && (
                <p className="mt-2 text-sm text-gray-700">{details.message}</p>
              )}

              <p className="mt-2 text-xs text-gray-500">
                {(() => {
                  try {
                    const date = new Date(notification.createdAt);
                    if (isNaN(date.getTime())) {
                      return "Date invalide";
                    }
                    return formatDistanceToNow(date, {
                      addSuffix: true,
                      locale: fr,
                    });
                  } catch (error) {
                    return "Date invalide";
                  }
                })()}
              </p>
            </div>

            {!isRead && (
              <div className="ml-2 flex-shrink-0">
                <div className="size-2 rounded-full bg-blue-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const NotificationPanel: React.FC = () => {
  const { isOpen, closeNotifications } = useNotifications();

  return (
    <Popover open={isOpen} onOpenChange={closeNotifications}>
      <PopoverTrigger asChild>
        <div />
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Notifications</h3>
            </div>
          </div>
        </div>

        <NotificationList />
      </PopoverContent>
    </Popover>
  );
};
