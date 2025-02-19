import React from "react";
import EditOffer from "./offer-edit";

export default function PageEdetOffer({ data, onSuccess }: { data: any; onSuccess?: () => void }) {
  return <EditOffer data={data} onSuccess={onSuccess} />;
}
