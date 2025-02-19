import React from "react";
import EditDriver from "./driver-edit";

export default function PageEdetDriver({ data, onSuccess }: { data: any; onSuccess?: () => void }) {
  if (!data) {
    return <div>Loading...</div>;
  }
  
  return <EditDriver data={data} onSuccess={onSuccess} />;
}
