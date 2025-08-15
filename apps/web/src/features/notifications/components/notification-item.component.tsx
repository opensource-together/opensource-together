import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";

import { Avatar } from "@/shared/components/ui/avatar";
import Icon from "@/shared/components/ui/icon";

import { useNotifications } from "../hooks/use-notifications.hook";
import { NotificationType } from "../types/notification.type";

export default function NotificationItem({
  notification,
  onNotificationClick,
}: {
  notification: NotificationType;
  onNotificationClick: () => void;
}) {
  const { markAsRead } = useNotifications();
  const router = useRouter();
  const isRead = !!notification.readAt;

  const handleNotificationClick = () => {
    if (!isRead) {
      markAsRead(notification.id);
    }

    // Redirection selon le type de notification
    if (notification.type === "project.role.application.created") {
      router.push("/dashboard/my-projects");
    }

    // Fermer le dropdown après le clic
    onNotificationClick();
  };

  const getNotificationDetails = (notification: NotificationType) => {
    const payload = notification.payload as {
      project: { title: string };
      projectRole: { title: string };
      userProfile: { name: string; avatarUrl: string };
      message: string;
    };

    switch (notification.type) {
      case "project.role.application.created":
        if (payload?.project && payload?.projectRole && payload?.userProfile) {
          return {
            title: "a candidaté à votre rôle",
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
      className={`cursor-pointer border-b border-gray-100 p-4 transition-colors last:border-b-0 hover:bg-gray-50 ${
        isRead ? "bg-gray-50" : "bg-white"
      }`}
      onClick={handleNotificationClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full tracking-tighter ${
              isRead ? "bg-gray-200" : "bg-black/5"
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
                className={`text-sm font-medium tracking-tighter ${
                  isRead ? "text-black/70" : "text-black"
                }`}
              >
                {details.user} {details.title}
              </p>

              {details.message && (
                <p className="mt-1 text-sm tracking-tight text-black/70">
                  {details.message}
                </p>
              )}

              <p className="text-end text-xs tracking-tight text-black/50">
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
                  } catch (_error) {
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
