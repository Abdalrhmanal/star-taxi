import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

type UseCreateDataOptions<T> = {
    dataSourceName: string;
};

type UseCreateDataResult<T> = {
    isLoading: boolean;
    isError: string | null;
    success: boolean;
    createData: (data: T) => Promise<void>;
};

const BASE_URL = "https://tawsella.online";

const useCreateData = function <T>({
    dataSourceName,
}: UseCreateDataOptions<T>): UseCreateDataResult<T> {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const createData = async (data: T): Promise<void> => {
        setIsLoading(true);
        setIsError(null);
        setSuccess(false);

        try {
            const token = Cookies.get("auth_user");
            if (!token) {
                throw new Error("Authentication token is missing.");
            }

            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            };

            const url = `${BASE_URL}/${dataSourceName}`;
            await axios.post(url, data, { headers }); // استخدام `POST` للإضافة

            setSuccess(true); // الإضافة ناجحة
        } catch (error: unknown) {
            if (error instanceof Error) {
                setIsError(error.message);
            } else {
                setIsError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, isError, success, createData };
};

export default useCreateData;
