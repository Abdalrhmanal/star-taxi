import React from "react";
import EditDriver from "./driver-edit";

export default async function PageEdetDriver({ data }: any) {
  if (!data) {
    return <div>Loading...</div>;
  }
  
  return <EditDriver data={data} />;
}
