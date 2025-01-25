import React from 'react'

function CreateDriver() {

    return (
        <>
            CreateDriver
        </>
    )
}

export default CreateDriver

/* 
import React, { useState } from "react";
import useCreateData from "./useCreateData";

type User = {
  name: string;
  email: string;
};

const AddUserComponent = () => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
  });

  const { isLoading, isError, success, createData } = useCreateData<User>({
    dataSourceName: "users", // المسار الخاص بإضافة المستخدمين
  });

  const handleCreate = async () => {
    await createData({
      name: user.name,
      email: user.email,
    });
  };

  return (
    <div>
      <h1>إضافة مستخدم جديد</h1>
      <input
        type="text"
        placeholder="الاسم"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <button onClick={handleCreate} disabled={isLoading}>
        {isLoading ? "جاري الإضافة..." : "إضافة"}
      </button>
      {isError && <p style={{ color: "red" }}>خطأ: {isError}</p>}
      {success && <p style={{ color: "green" }}>تمت الإضافة بنجاح!</p>}
    </div>
  );
};

export default AddUserComponent;

*/