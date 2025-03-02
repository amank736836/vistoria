"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  show: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    visible: boolean;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type, visible: true });

    setTimeout(() => {
      setNotification((prev) => (prev ? { ...prev, visible: false } : null));
    }, 3000);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ show: showNotification }}>
      {notification && (
        <div
          className={`top-5 right-5 max-w-xs px-6 py-3 rounded-lg text-white shadow-lg transition-all duration-500 flex items-center justify-between 
            ${
              notification.visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            } 
            ${getAlertClass(notification.type)}
          `}
        >
          <span>{notification.message}</span>
          <button
            onClick={closeNotification}
            className="ml-4 text-white text-lg font-bold ml-10"
          >
            ✖
          </button>
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  );
}

function getAlertClass(type: NotificationType) {
  switch (type) {
    case "success":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    case "warning":
      return "bg-yellow-500";
    case "info":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
