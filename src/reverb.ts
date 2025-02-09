"use client";

import Echo from "laravel-echo";
import Cookies from "js-cookie";
import Pusher from "pusher-js"; // ✅ Laravel Echo يحتاج إلى Pusher حتى مع Reverb

declare global {
  interface Window {
    Echo?: any;
    Pusher?: any;
  }
}

const getEchoInstance = () => {
  if (typeof window === "undefined") return null;

  // ✅ تأكد من تعريف Pusher حتى لا يحدث الخطأ
  if (!window.Pusher) {
    window.Pusher = Pusher;
  }

  if (!window.Echo) {
    const token = Cookies.get("auth_user");

    window.Echo = new Echo({
      broadcaster: "reverb", // ✅ استخدم "reverb" كـ broadcaster
      key: "ni31bwqnyb4g9pbkk7sn",
      wsHost: "reverb.tawsella.online",
      wsPort: 6001, // تأكد من صحة المنفذ حسب إعدادات السيرفر
      wssPort: 443,
      forceTLS: true,
      disableStats: true,
      enabledTransports: ["ws", "wss"], // جرب ["polling", "websocket"] إذا استمر الفشل
      authEndpoint: "https://tawsella.online/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }

  return window.Echo;
};

export default getEchoInstance;
