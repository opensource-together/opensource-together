import NotificationBell from "./notification-bell.component";
import { NotificationPanel } from "./notification-panel.component";

export const NotificationDropdown: React.FC = () => {
  return (
    <div className="relative">
      <NotificationBell />
      <NotificationPanel />
    </div>
  );
};
