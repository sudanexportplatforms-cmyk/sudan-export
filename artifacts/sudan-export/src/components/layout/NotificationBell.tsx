import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  useListNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead 
} from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function NotificationBell() {
  const { t } = useTranslation();
  const { data: notifications = [] } = useListNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-primary hover:bg-primary/5">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <DropdownMenuLabel className="font-semibold px-0 py-0">{t("notifications.title")}</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-primary h-auto py-1 px-2"
              onClick={(e) => {
                e.preventDefault();
                markAllRead.mutate(undefined);
              }}
              disabled={markAllRead.isPending}
            >
              {t("notifications.markAllRead")}
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              {t("notifications.none")}
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`flex flex-col items-start p-4 cursor-pointer border-b last:border-b-0 ${notification.isRead ? 'opacity-70' : 'bg-primary/5'}`}
                onClick={(e) => {
                  if (!notification.isRead) {
                    markRead.mutate({ notificationId: notification.id });
                  }
                  if (notification.link) {
                    // Routing would happen here, but wouter Link is better if possible.
                  }
                }}
              >
                <div className="flex justify-between w-full mb-1">
                  <span className="font-semibold text-sm text-gray-900">{notification.title}</span>
                  <span className="text-xs text-gray-500 whitespace-nowrap ltr:ml-2 rtl:mr-2">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 w-full">{notification.body}</p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
