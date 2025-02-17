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
} from "@mui/material";
import useGlobalData from "@/hooks/get-global";
import useCreateData from "@/hooks/post-global";

// تعريف واجهة لبيانات السائق
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

// تعريف واجهة لجسم الإشعار
interface NotificationBody {
  message: string;
  driver?: Driver;
}

// تعريف واجهة للإشعار
interface Notification {
  id: string;
  data: {
    title: string;
    body: NotificationBody;
    isRead?: boolean;
  };
}

function Notifications() {
  // نقطة النهاية الموحدة لجميع الطلبات
  const notificationsApi = "api/notifications";

  // جلب جميع الإشعارات
  const {
    data: GlobalData,
    isLoading: GlobalLoading,
    refetch,
  } = useGlobalData<{ message: string; data: Notification[] }>({
    dataSourceName: notificationsApi,
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  // جلب الإشعارات غير المقروءة فقط
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

  // hook لإرسال الطلب لتعليم إشعار أو مجموعة إشعارات كمقروءة
  const {
    isLoading: markingLoading,
    createData: markAsReadRequest,
  } = useCreateData<any>({
    dataSourceName: notificationsApi,
  });

  // الحالة المحلية للبيانات
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (GlobalData?.data) {
      const parsedData = Array.isArray(GlobalData.data) ? GlobalData.data : [];
      setNotifications(parsedData);
    }
  }, [GlobalData]);

  useEffect(() => {
    if (UnreadData?.data) {
      const parsedData = Array.isArray(UnreadData.data) ? UnreadData.data : [];
      setUnreadNotifications(parsedData);
    }
  }, [UnreadData]);

  // تقسيم الإشعارات إلى مقروءة وغير مقروءة
  const readNotifications = notifications.filter(
    (n) => !unreadNotifications.some((u) => u.id === n.id)
  );
  const unreadNotificationsFiltered = notifications.filter((n) =>
    unreadNotifications.some((u) => u.id === n.id)
  );

  // دالة لتعليم إشعار مفرد كمقروء بإرسال معرف الإشعار في جسم الطلب
  const markSingleNotificationAsRead = async (notificationId: string) => {
    try {
      // تحديث الحالة المحلية
      setUnreadNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, data: { ...n.data, isRead: true } }
            : n
        )
      );

      // إرسال الطلب مع تضمين معرف الإشعار في الجسم
      await markAsReadRequest!({ data: { notificationId } });

      // إعادة جلب البيانات من الخادم
      refetch();
      refetchUnread();
    } catch (error) {
      console.error("❌ حدث خطأ أثناء تمييز الإشعار كمقروء:", error);
    }
  };

  // دالة لتعليم جميع الإشعارات كمقروءة بإرسال جسم الطلب المناسب
  const markAllAsReadHandler = async () => {
    try {
      // تحديث الحالة المحلية
      setUnreadNotifications([]);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, data: { ...n.data, isRead: true } }))
      );

      // إرسال الطلب مع تحديد markAll في الجسم
      await markAsReadRequest!({ data: { markAll: true } });

      // إعادة جلب البيانات من الخادم
      refetch();
      refetchUnread();
    } catch (error) {
      console.error("❌ حدث خطأ أثناء تمييز جميع الإشعارات كمقروءة:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* عنوان الصفحة */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        الإشعارات
      </Typography>
      {/* زر تمييز الكل كمقروء */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={markAllAsReadHandler}
          disabled={markingLoading}
          startIcon={markingLoading && <CircularProgress size={20} />}
        >
          {markingLoading ? "جارٍ التحديث..." : "تمييز الكل كمقروء"}
        </Button>
      </Box>
      {/* حالة التحميل */}
      {(GlobalLoading || UnreadLoading) && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {/* عرض الإشعارات غير المقروءة */}
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
                    onClick={() =>{}
                     /*  markSingleNotificationAsRead(notification.id) */
                    }
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "#e3f2fd",
                      "&:hover": { backgroundColor: "#bbdefb" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={
                          notification.data.body.driver?.avatar ||
                          "/images/default-avatar.png"
                        }
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
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </>
        )}
      {/* عرض الإشعارات المقروءة */}
      {!GlobalLoading && !UnreadLoading && readNotifications.length > 0 && (
        <>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            الإشعارات المقروءة
          </Typography>
          <List>
            {readNotifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      src={
                        notification.data.body.driver?.avatar ||
                        "/images/default-avatar.png"
                      }
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
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </>
      )}
      {/* إذا لم توجد إشعارات */}
      {!GlobalLoading &&
        !UnreadLoading &&
        notifications.length === 0 && (
          <Typography
            variant="subtitle1"
            color="text.secondary"
            textAlign="center"
          >
            لا توجد إشعارات حاليًا.
          </Typography>
        )}
    </Box>
  );
}

export default Notifications;
