import React from "react";
import EditCar from "./taxi-edit";

export default function PageTaxiEdit({ data, onSuccess }: { data: any; onSuccess?: () => void }) {
  return <EditCar data={data} onSuccess={onSuccess}/>;
}
