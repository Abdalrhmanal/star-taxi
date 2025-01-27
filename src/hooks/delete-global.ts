import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

type UseDeleteDataOptions = {
    dataSourceName: string;
};

type UseDeleteDataResult = {
    isLoading: boolean;
    isError: string | null;
    success: boolean;
    deleteData: (id: string | number) => Promise<void>;
};

const BASE_URL = "https://tawsella.online";

const useDeleteData = function ({
    dataSourceName,
}: UseDeleteDataOptions): UseDeleteDataResult {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const deleteData = async (id: string | number): Promise<void> => {
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
            await axios.delete(url, { headers }); // استخدام `DELETE` للحذف

            setSuccess(true); // الحذف ناجح
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

    return { isLoading, isError, success, deleteData };
};

export default useDeleteData;

/* 
import React from "react";
import useDeleteData from "./useDeleteData";

const DeleteUserComponent = () => {
  const { isLoading, isError, success, deleteData } = useDeleteData({
    dataSourceName: "users", // المسار الخاص بحذف المستخدمين
  });

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("هل أنت متأكد أنك تريد حذف هذا العنصر؟");
    if (confirm) {
      await deleteData(id);
    }
  };

  return (
    <div>
      <h1>حذف المستخدم</h1>
      <button onClick={() => handleDelete("123")} disabled={isLoading}>
        {isLoading ? "جاري الحذف..." : "حذف"}
      </button>
      {isError && <p style={{ color: "red" }}>خطأ: {isError}</p>}
      {success && <p style={{ color: "green" }}>تم الحذف بنجاح!</p>}
    </div>
  );
};

export default DeleteUserComponent;

*/