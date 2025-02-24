"use client";

import Home from "@/components/dashboard";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // تأكد من مسار الاستيراد الصحيح
import Cookies from "js-cookie";

export default function Page() {
  const { user } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !userId) {
      try {
        const userData = Cookies.get("user_data");
        if (userData) {
          const parsedData = JSON.parse(decodeURIComponent(userData));
          setUserId(parsedData.id);
        }
      } catch (error) {
        console.error("❌ خطأ في تحليل بيانات user_data:", error);
      }
    }
  }, [userId]);

  console.log("userId : ", userId);
  return (
    <Suspense fallback={<div>Loading Home...</div>}>
      <Home adminId={user?.id || userId || ""} />
    </Suspense>
  );
}