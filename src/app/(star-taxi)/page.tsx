// app/(star-taxi)/page.tsx
import Home from "@/components/dashboard";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Home...</div>}>
      <Home />
    </Suspense>
  );
}
