"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// تعريف نوع بيانات المستخدم
type User = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  avatar: string | null;
  role: string;
  permissions: string[];
};

// تعريف نوع بيانات سياق المصادقة
type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// إنشاء سياق المصادقة
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// مزود سياق المصادقة
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // جلب بيانات المستخدم من الكوكيز عند أول تحميل
  useEffect(() => {
    const storedUser = Cookies.get("user_data");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // تحويل البيانات من JSON إلى كائن
      } catch (error) {
        console.error("Error parsing user data from cookies:", error);
      }
    }
  }, []);

  // تحديث الكوكيز عند تغيير بيانات المستخدم
  useEffect(() => {
    if (user) {
      Cookies.set("user_data", JSON.stringify(user), { expires: 7, secure: true });
    } else {
      Cookies.remove("user_data"); // إزالة الكوكيز إذا كان المستخدم null
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// هوك لاستخدام سياق المصادقة
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};