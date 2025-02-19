import React from "react";
import EditDriver from "./driver-edit";
import useGlobalData from "@/hooks/get-global";

export interface DriverData {
  driver_id: string;
  name: string;
  gender: "Male" | "Female";
  email: string;
  phone_number: string;
  avatar: string;
  is_active: number;
  has_taxi: boolean;
  unBring: number;
  driver_state: number;
  plate_number: string;
  lamp_number: string;
}

type PageEdetDriverProps = {
  driver_id: string;
  onSuccess?: () => void;
};

const PageEdetDriver = ({ driver_id, onSuccess }: PageEdetDriverProps) => {
  console.log(driver_id);

  const dataSourceName = `api/drivers/${driver_id}`;
  const {
    data: GlobalData,
    isLoading: GlobalLoading,
  } = useGlobalData<DriverData | any>({
    dataSourceName,
    enabled: true,
    setOldDataAsPlaceholder: true,
  });

  const data = GlobalData || {};
  console.log(data);

  return <EditDriver data={data} onSuccess={onSuccess} />;
};

export default PageEdetDriver;