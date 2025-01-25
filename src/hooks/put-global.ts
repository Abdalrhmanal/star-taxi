import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

type UseUpdateDataOptions<T> = {
  dataSourceName: string;
};

type UseUpdateDataResult<T> = {
  isLoading: boolean;
  isError: string | null;
  success: boolean;
  updateData: (data: T) => Promise<void>;
};

const BASE_URL = "https://tawsella.online";

const useUpdateData = function <T>({
  dataSourceName,
}: UseUpdateDataOptions<T>): UseUpdateDataResult<T> {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateData = async (data: T): Promise<void> => {
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
      await axios.put(url, data, { headers }); // استخدام `PUT` للتعديل

      setSuccess(true); // التعديل ناجح
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

  return { isLoading, isError, success, updateData };
};

export default useUpdateData;
