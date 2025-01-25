import React from 'react'

function EditDriver() {

    return (
        <>
            EditDriver
        </>
    )
}

export default EditDriver
/* 
import React, { useState } from "react";
import useUpdateData from "./useUpdateData";

type User = {
  id: string;
  name: string;
  email: string;
};

const EditUserComponent = () => {
  const [user, setUser] = useState<User>({
    id: "123",
    name: "John Doe",
    email: "john.doe@example.com",
  });

  const { isLoading, isError, success, updateData } = useUpdateData<User>({
    dataSourceName: `users/${user.id}`, // مسار API لتحديث المستخدم
  });

  const handleUpdate = async () => {
    await updateData({
      name: user.name,
      email: user.email,
    });
  };

  return (
    <div>
      <h1>تعديل المستخدم</h1>
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <button onClick={handleUpdate} disabled={isLoading}>
        {isLoading ? "جاري التحديث..." : "تحديث"}
      </button>
      {isError && <p style={{ color: "red" }}>خطأ: {isError}</p>}
      {success && <p style={{ color: "green" }}>تم التعديل بنجاح!</p>}
    </div>
  );
};

export default EditUserComponent;

*/