import React from "react";
import EditAdvertisements from "./page";

export default function PageEditAdvertisements({ data, onSuccess }: { data: any; onSuccess?: () => void }) {
  return <EditAdvertisements data={data} onSuccess={onSuccess} />;
}
