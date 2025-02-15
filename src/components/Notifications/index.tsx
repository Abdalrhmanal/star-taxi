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
  driver?: Driver; // السائق اختياري
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
  // جلب جميع الإشعارات
  const notificationsApi = "api/notifications";
  const { data: GlobalData, isLoading: GlobalLoading, refetch } = useGlobalData<{
    message: string;
    data: Notification[];
  }>({
    dataSourceName: notificationsApi,
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  // جلب الإشعارات غير المقروءة فقط
  const unreadNotificationsApi = "api/notifications/unread";
  const { data: UnreadData, isLoading: UnreadLoading, refetch: refetchUnread } = useGlobalData<{
    message: string;
    data: Notification[];
  }>({
    dataSourceName: unreadNotificationsApi,
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  // تمييز جميع الإشعارات كمقروءة
  const { isLoading: markAllLoading, createData: markAllAsRead } = useCreateData<any>({
    dataSourceName: notificationsApi,
  });

  // حالة البيانات المحلية
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (GlobalData?.data) {
      // التأكد من أن البيانات هي مصفوفة
      const parsedData = Array.isArray(GlobalData.data) ? GlobalData.data : [];
      setNotifications(parsedData);
    }
  }, [GlobalData]);

  useEffect(() => {
    if (UnreadData?.data) {
      // التأكد من أن البيانات هي مصفوفة
      const parsedData = Array.isArray(UnreadData.data) ? UnreadData.data : [];
      setUnreadNotifications(parsedData);
    }
  }, [UnreadData]);

  // تقسيم الإشعارات إلى مقروءة وغير مقروءة
  const readNotifications = Array.isArray(notifications)
    ? notifications.filter((n) => !unreadNotifications.some((u) => u.id === n.id))
    : [];

  const unreadNotificationsFiltered = Array.isArray(notifications)
    ? notifications.filter((n) => unreadNotifications.some((u) => u.id === n.id))
    : [];

  // استدعاء hook خارج الدالة
  const { createData: markSingleAsRead } = useCreateData<any>({
    dataSourceName: `api/notifications/`,
  });

  // تمييز إشعار محدد كمقروء
  const markAsRead = async (notificationId: string) => {
    try {
      // تحديث البيانات المحلية
      const updatedUnread = unreadNotifications.filter((n) => n.id !== notificationId);
      setUnreadNotifications(updatedUnread);
      const updatedNotifications = notifications.map((n) =>
        n.id === notificationId ? { ...n, data: { ...n.data, isRead: true } } : n
      );
      setNotifications(updatedNotifications);

      // إرسال طلب إلى الـ API لتمييز الإشعار كمقروء
      await markSingleAsRead({
        notificationId, // تمرير معرف الإشعار إلى الـ API
      });

      // إعادة جلب البيانات من الخادم
      refetch();
      refetchUnread();
    } catch (error) {
      console.error("❌ حدث خطأ أثناء تمييز الإشعار كمقروء:", error);
    }
  };

  // تمييز جميع الإشعارات كمقروءة
  const markAllAsReadHandler = async () => {
    try {
      // تحديث البيانات المحلية
      setUnreadNotifications([]);
      setNotifications(notifications.map((n) => ({ ...n, data: { ...n.data, isRead: true } })));

      // إرسال طلب إلى الـ API لتمييز جميع الإشعارات كمقروءة
      await markAllAsRead({});

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
          disabled={markAllLoading}
          startIcon={markAllLoading && <CircularProgress size={20} />}
        >
          {markAllLoading ? "جارٍ التحديث..." : "تمييز الكل كمقروء"}
        </Button>
      </Box>

      {/* حالة التحميل */}
      {(GlobalLoading || UnreadLoading) && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* عرض الإشعارات غير المقروءة */}
      {!GlobalLoading && !UnreadLoading && unreadNotificationsFiltered.length > 0 && (
        <>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            الإشعارات غير المقروءة
          </Typography>
          <List>
            {unreadNotificationsFiltered.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => markAsRead(notification.id)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "#e3f2fd", // لون خلفية الإشعارات غير المقروءة
                    "&:hover": { backgroundColor: "#bbdefb" },
                  }}
                >
                  <ListItemAvatar>
                    {/* التحقق من وجود body و driver باستخدام optional chaining */}
                    <Avatar src={notification.data.body.driver?.avatar || "/images/default-avatar.png"} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {notification.data.title}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        {/* التحقق من وجود body و message باستخدام optional chaining */}
                        <Typography component="span" variant="body2" color="text.primary">
                          {notification.data.body.message || "لا يوجد رسالة"}
                        </Typography>
                        {/* التحقق من وجود body و driver باستخدام optional chaining */}
                        {notification.data.body.driver && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            السائق: {notification.data.body.driver.name || "غير معروف"}
                          </Typography>
                        )}
                      </React.Fragment>
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
                    {/* التحقق من وجود body و driver باستخدام optional chaining */}
                    <Avatar src={notification.data.body.driver?.avatar || "/images/default-avatar.png"} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.data.title}
                    secondary={
                      <React.Fragment>
                        {/* التحقق من وجود body و message باستخدام optional chaining */}
                        <Typography component="span" variant="body2" color="text.primary">
                          {notification.data.body.message || "لا يوجد رسالة"}
                        </Typography>
                        {/* التحقق من وجود body و driver باستخدام optional chaining */}
                        {notification.data.body.driver && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            السائق: {notification.data.body.driver.name || "غير معروف"}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </>
      )}

      {/* إذا لم تكن هناك إشعارات */}
      {!GlobalLoading && !UnreadLoading && notifications.length === 0 && (
        <Typography variant="subtitle1" color="text.secondary" textAlign="center">
          لا توجد إشعارات حاليًا.
        </Typography>
      )}
    </Box>
  );
}

export default Notifications;