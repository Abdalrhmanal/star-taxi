// app/(star-taxi)/movement-types/edit/page.tsx
import React from "react";
import EditMovementType from "./edit-movement-type";

// نستخدم Server Component لجلب البيانات
export default function PageMovment({ data, onSuccess }: { data: any; onSuccess?: () => void }) {
  return <EditMovementType data={data} onSuccess={onSuccess} />;
}
