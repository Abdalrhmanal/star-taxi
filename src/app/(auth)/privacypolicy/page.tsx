"use client";
import React from 'react'
import { Container, Typography, Paper } from "@mui/material";

function PrivacyPolicy() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    سياسة الخصوصية - StarTaxi
                </Typography>
                <Typography variant="body1" paragraph>
                    تاريخ التحديث: [أدخل التاريخ]
                </Typography>

                <Typography variant="h5" gutterBottom>
                    1. المعلومات التي نقوم بجمعها
                </Typography>
                <Typography variant="h6" gutterBottom>
                    1.1 المعلومات التي تقدمها لنا
                </Typography>
                <Typography variant="body1" paragraph>
                    عند استخدام تطبيق StarTaxi، قد نطلب منك تقديم بعض المعلومات الشخصية مثل:
                    <ul>
                        <li>الاسم</li>
                        <li>البريد الإلكتروني</li>
                        <li>رقم الهاتف</li>
                        <li>معلومات الدفع عند الحاجة</li>
                    </ul>
                </Typography>

                <Typography variant="h6" gutterBottom>
                    1.2 المعلومات التي يتم جمعها تلقائيًا
                </Typography>
                <Typography variant="body1" paragraph>
                    نقوم بجمع بعض المعلومات تلقائيًا، مثل:
                    <ul>
                        <li>بيانات الجهاز (نظام التشغيل، نوع الجهاز، معرف الجهاز)</li>
                        <li>الموقع الجغرافي لتحديد موقع المستخدم والسائق</li>
                        <li>بيانات الاستخدام مثل الصفحات التي تزورها داخل التطبيق</li>
                    </ul>
                </Typography>

                <Typography variant="h5" gutterBottom>
                    2. كيفية استخدام المعلومات
                </Typography>
                <Typography variant="body1" paragraph>
                    نستخدم المعلومات التي نجمعها من أجل:
                    <ul>
                        <li>تقديم خدمات StarTaxi وتحسين تجربة المستخدم</li>
                        <li>تتبع موقع السائق وعرضه على الخريطة داخل التطبيق</li>
                        <li>تحليل أداء التطبيق وتحسينه</li>
                        <li>إرسال الإشعارات والتحديثات حول الخدمة</li>
                    </ul>
                </Typography>

                <Typography variant="h5" gutterBottom>
                    3. مشاركة المعلومات مع جهات خارجية
                </Typography>
                <Typography variant="body1" paragraph>
                    نحن لا نبيع أو نشارك بياناتك مع أطراف ثالثة، إلا في الحالات التالية:
                    <ul>
                        <li>عند استخدام خدمات طرف ثالث مثل خرائط Google لعرض موقع السائق</li>
                        <li>عندما يكون ذلك مطلوبًا بموجب القانون</li>
                    </ul>
                </Typography>

                <Typography variant="h5" gutterBottom>
                    4. الأمان
                </Typography>
                <Typography variant="body1" paragraph>
                    نحن نتخذ إجراءات أمان لحماية بياناتك، ولكن لا يمكن ضمان الأمان الكامل للمعلومات عبر الإنترنت.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    5. حقوق المستخدم
                </Typography>
                <Typography variant="body1" paragraph>
                    يمكنك طلب الوصول إلى بياناتك أو تعديلها أو حذفها من خلال التواصل معنا عبر البريد الإلكتروني التالي:
                    <br />
                    ✉️ support@startaxi.com
                </Typography>

                <Typography variant="h5" gutterBottom>
                    6. التعديلات على سياسة الخصوصية
                </Typography>
                <Typography variant="body1" paragraph>
                    قد نقوم بتحديث هذه السياسة من وقت لآخر، وسنقوم بإعلامك بأي تغييرات جوهرية.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    7. التواصل معنا
                </Typography>
                <Typography variant="body1" paragraph>
                    إذا كان لديك أي استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر:
                    <br />
                    ✉️ البريد الإلكتروني: startaxi@gmail.com
                    <br />
                    🌍 الموقع الإلكتروني: www.startaxi-sk.com
                </Typography>
            </Paper>
        </Container>
    )
}

export default PrivacyPolicy;



