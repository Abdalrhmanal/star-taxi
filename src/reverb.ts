"use client";

import Echo from "laravel-echo";
import Cookies from "js-cookie";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Echo?: any;
    Pusher?: any;
  }
}

const getEchoInstance = () => {
  if (typeof window === "undefined") return null;

  if (!window.Pusher) {
    window.Pusher = Pusher;
  }

  if (!window.Echo) {
    const token = Cookies.get("auth_user");

    window.Echo = new Echo({
      broadcaster: "reverb", 
      key: "ni31bwqnyb4g9pbkk7sn",
      wsHost: "reverb.tawsella.online",
      wsPort: 6001,
      wssPort: 443,
      forceTLS: true,
      disableStats: true,
      enabledTransports: ["ws", "wss"], 
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
