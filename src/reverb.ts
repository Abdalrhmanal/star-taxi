import Echo from "laravel-echo";
import Cookies from "js-cookie";
import Pusher from "pusher-js"; 

declare global {
  interface Window {
    Echo?: Echo<any>;
  }
}

const getEchoInstance = () => {
  if (typeof window === "undefined") return null; 

  if (!window.Echo) {
    const token = Cookies.get("auth_user");

    window.Echo = new Echo({
      broadcaster: "reverb",
      key: "ni31bwqnyb4g9pbkk7sn",
      wsHost: "reverb.tawsella.online",
      wsPort: 8090,
      wssPort: 443,
      forceTLS: true,
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
