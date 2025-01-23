import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

type LoginData = {
    email: string;
    password: string;
};

interface LoginResponse {
    data: {
        token: string;
        user: {
            id: string;
            email: string;
            profile: {
                name: string;
                phone_number: string;
                avatar: string;
            };
            roles: Array<{ name: string }>;
            is_active: boolean;
            created_at: string;
            rating: number;
        };
    }
}

const useLogin = () => {
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const login = async (data: LoginData) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post<LoginResponse>(
                "https://tawsella.online/api/login",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            const responseData = response?.data;
            const { token, user } = responseData?.data;
            console.log(response?.data);
            console.log(token);

            // استخراج البيانات الجديدة
            const userDetails = {
                id: user.id,
                email: user.email,
                username: user.profile.name,
                fullName: user.profile.name,
                phoneNumber: user.profile.phone_number,
                avatar: user.profile.avatar,
                role: user.roles[0]?.name || "N/A",
                permissions: user.roles.map((role) => role.name),
                isActive: user.is_active,
                createdAt: user.created_at,
                rating: user.rating,
            };

            // تخزين البيانات في الكوكيز
            Cookies.set("auth_user", token, { expires: 7, secure: true });
            Cookies.set("user_data", JSON.stringify(userDetails), { expires: 7, secure: true });

            // تحديث حالة المستخدم
            setSuccess("Successfully logged in!");
            setUser(userDetails);
            router.push("/");
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error, success };
};

export default useLogin;
