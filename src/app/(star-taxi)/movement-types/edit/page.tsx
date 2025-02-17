// app/(star-taxi)/movement-types/edit/page.tsx
import React from "react";
import EditMovementType from "./edit-movement-type";

// نستخدم Server Component لجلب البيانات
export default async function Page({ data }: any) {
  return <EditMovementType data={data} />;
}
