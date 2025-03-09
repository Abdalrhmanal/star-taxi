"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import useGlobalData from "@/hooks/get-global";
import useCreateData from "@/hooks/post-global";

interface Driver {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  phone_number: string;
  gender: number;
  birthdate: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface NotificationBody {
  message: string;
  driver?: Driver;
}

interface Notification {
  id: string;
  data: {
    title: string;
    body: NotificationBody;
    isRead?: boolean;
  };
}

function Notifications({ onSuccess }: { onSuccess?: () => void }) {
  const notificationsApi = "api/notifications";
  const {
    data: GlobalData,
    isLoading: GlobalLoading,
    refetch,
  } = useGlobalData<{ message: string; data: Notification[] }>({
    dataSourceName: notificationsApi,
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  const unreadNotificationsApi = "api/notifications/unread";
  const {
    data: UnreadData,
    isLoading: UnreadLoading,
    refetch: refetchUnread,
  } = useGlobalData<{ message: string; data: Notification[] }>({
    dataSourceName: unreadNotificationsApi,
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  const {
    isLoading: markingLoading,
    createData: markAsReadRequest,
    success,
    isError
  } = useCreateData<any>({
    dataSourceName: notificationsApi,
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const markAllAsReadHandler = async () => {
    try {
      await markAsReadRequest({ data: { markAll: true } });
    } catch (error) {
      console.error("❌ حدث خطأ أثناء تمييز جميع الإشعارات كمقروءة:", error);
    }
  };

  const refreshUnreadNotifications = () => {
    refetchUnread();
  };

  useEffect(() => {
    if (success) {
      setNotificationMessage("تم تمييز جميع الإشعارات كمقروءة بنجاح.");
      setNotificationOpen(true);
      if (onSuccess) onSuccess();
      
      // تأخير تحديث البيانات لمنع التكرار
      setTimeout(() => {
        refetch();
        refetchUnread();
      }, 500);
    } else if (isError) {
      setNotificationMessage(`❌ حدث خطأ أثناء تمييز جميع الإشعارات كمقروءة: ${isError}`);
      setNotificationOpen(true);
    }
  }, [success, isError]);
  
  useEffect(() => {
    if (!GlobalLoading && GlobalData?.data) {
      const parsedData = Array.isArray(GlobalData.data) ? GlobalData.data : [];
      if (JSON.stringify(parsedData) !== JSON.stringify(notifications)) {
        setNotifications(parsedData);
      }
    }
  }, [GlobalLoading, GlobalData, notifications]);
  
  useEffect(() => {
    if (!UnreadLoading && UnreadData?.data) {
      const parsedData = Array.isArray(UnreadData.data) ? UnreadData.data : [];
      if (JSON.stringify(parsedData) !== JSON.stringify(unreadNotifications)) {
        setUnreadNotifications(parsedData);
      }
    }
  }, [UnreadLoading, UnreadData, unreadNotifications]);
  
  const readNotifications = notifications.filter(
    (n) => !unreadNotifications.some((u) => u.id === n.id)
  ).slice(0, 20); // عرض آخر 20 إشعار مقروء فقط
  const unreadNotificationsFiltered = notifications.filter((n) =>
    unreadNotifications.some((u) => u.id === n.id)
  );

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  return (
    <Box sx={{ p: 3, direction: "rtl", textAlign: "right" }}>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={success ? "success" : "error"} sx={{ width: "100%" }}>
          {notificationMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        الإشعارات
      </Typography>

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={markAllAsReadHandler}
          disabled={markingLoading}
          startIcon={markingLoading && <CircularProgress size={20} />}
        >
          {markingLoading ? "جارٍ التحديث..." : "تمييز الكل كمقروء"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={refreshUnreadNotifications}
          disabled={UnreadLoading}
          startIcon={UnreadLoading && <CircularProgress size={20} />}
        >
          {UnreadLoading ? "جارٍ التحديث..." : "تحديث"}
        </Button>
      </Box>

      {(GlobalLoading || UnreadLoading) && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {!GlobalLoading &&
        !UnreadLoading &&
        unreadNotificationsFiltered.length > 0 && (
          <>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              الإشعارات غير المقروءة
            </Typography>
            <List>
              {unreadNotificationsFiltered.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "#e3f2fd",
                      "&:hover": { backgroundColor: "#bbdefb" },
                    }}
                  >
                    <ListItemAvatar sx={{ mr: 2 }}>
                      <Avatar
                        src={`https://tawsella.online${notification.data.body.driver?.avatar}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {notification.data.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {notification.data.body.message || "لا يوجد رسالة"}
                          </Typography>
                          {notification.data.body.driver && (
                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                            >
                              السائق:{" "}
                              {notification.data.body.driver.name || "غير معروف"}
                            </Typography>
                          )}
                        </>
                      }
                      sx={{ textAlign: "right" }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </>
        )}

      {!GlobalLoading && !UnreadLoading && readNotifications.length > 0 && (
        <>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            الإشعارات المقروءة
          </Typography>
          <List>
            {readNotifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar sx={{ mr: 2 }}>
                    <Avatar
                      src={`https://tawsella.online${notification.data.body.driver?.avatar}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.data.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.data.body.message || "لا يوجد رسالة"}
                        </Typography>
                        {notification.data.body.driver && (
                          <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            السائق:{" "}
                            {notification.data.body.driver.name || "غير معروف"}
                          </Typography>
                        )}
                      </>
                    }
                    sx={{ textAlign: "right" }}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </>
      )}

      {!GlobalLoading &&
        !UnreadLoading &&
        notifications.length === 0 && (
          <Typography variant="subtitle1" color="text.secondary" textAlign="center">
            لا توجد إشعارات حاليًا.
          </Typography>
        )}
    </Box>
  );
}

export default Notifications;