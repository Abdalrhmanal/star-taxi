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
  datas: any;
  onSuccess?: () => void;
};

const PageEdetDriver = ({ datas, onSuccess }: PageEdetDriverProps) => {

  return <EditDriver data={datas} onSuccess={onSuccess} />;
};

export default PageEdetDriver;