import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

type UseGlobalDataOptions<T> = {
  dataSourceName: string;
  enabled?: boolean;
  setOldDataAsPlaceholder?: boolean;
};

type UseGlobalDataResult<T> = {
  data: T | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: string | null;
  refetch: () => void;
};

const BASE_URL = "https://tawsella.online";

const useGlobalData = function <T>({
  dataSourceName,
  enabled = true,
  setOldDataAsPlaceholder = false,
}: UseGlobalDataOptions<T>): UseGlobalDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!enabled) return;

    setIsFetching(true);
    setIsError(null);

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
      const response = await axios.get<T>(url, { headers });
      setData(response.data);
    } catch (error: unknown) {
       if (error instanceof Error) {
        setIsError(error.message);
      } else {
        setIsError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      setIsLoading(true);
      fetchData();
    }
  }, [
    dataSourceName,
    enabled,
  ]);

  const refetch = () => {
    fetchData();
  };

  return { data, isLoading, isFetching, isError, refetch };
};

export default useGlobalData;
