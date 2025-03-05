import React from "react";
import EditAdvertisements from "./advertisements-edit";

export default function PageEditAdvertisements({ data, onSuccess }: { data: any; onSuccess?: () => void }) {
  return <EditAdvertisements data={data} onSuccess={onSuccess} />;
}
