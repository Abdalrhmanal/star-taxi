import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type UseLogoutResult = {
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
};

const useLogout = (): UseLogoutResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const logout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = Cookies.get("auth_user");
      if (token) {
        const response = await axios.post(
          "https://tawsella.online/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          Cookies.remove("auth_user");
          Cookies.remove("user_data");

          setSuccess("Successfully logged out!");
            router.push("/login");
        } else if (response.status === 401) {
          Cookies.remove("auth_user");
          Cookies.remove("user_data");

        } 
        else {
          throw new Error("Failed to logout from the server.");
        }
      } else {
        // إذا لم يتم العثور على التوكن
        Cookies.remove("auth_user");
        Cookies.remove("user_data");
        setSuccess("Session cleared locally.");
        router.push("/login");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to logout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error, success };
};

export default useLogout;
