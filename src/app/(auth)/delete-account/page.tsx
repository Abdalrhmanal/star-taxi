import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';

const DeleteAccount: React.FC = () => {
    return (
        <Container component="main" maxWidth="sm" dir="rtl">
            <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
                <Typography variant="h4" align="center" color="error">
                    حذف حساب المستخدم
                </Typography>
                <Typography variant="body1" align="center" style={{ margin: '20px 0' }}>
                    لحذف حسابك، يجب عليك اتباع الخطوات التالية:
                </Typography>
                <Box component="ol" sx={{ paddingRight: 2 }}>
                    <li>
                        <Typography variant="h5">افتح تطبيقنا وتوجه إلى صفحة البروفايل.</Typography>
                        <Box display="flex" justifyContent="center">
                            <img src="/images/step1.png" alt="الخطوة 1" style={{ width: '300px', height: '600px', borderRadius: '8px' }} />
                        </Box>
                    </li>
                    <li>
                        <Typography variant="h5">اختر خيار "حذف الحساب".</Typography>
                        <Box display="flex" justifyContent="center">
                            <img src="/images/step2.png" alt="الخطوة 2" style={{ width: '300px', height: '600px', borderRadius: '8px' }} />
                        </Box>
                    </li>
                    <li>
                        <Typography variant="h5">قم بتأكيد عملية الحذف من خلال النقر على زر التأكيد في الواجهة المنبثقة.</Typography>
                        <Box display="flex" justifyContent="center">
                            <img src="/images/step3.png" alt="الخطوة 3" style={{ width: '300px', height: '600px', borderRadius: '8px' }} />
                        </Box>
                    </li>
                </Box>
                <Typography variant="body1" align="center" style={{ margin: '20px 0' }}>
                    يرجى ملاحظة أن حذف حسابك سيؤدي إلى:
                </Typography>
                <Box component="ul" sx={{ paddingRight: 2 }}>
                    <li>
                        <Typography variant="body2">حذف كافة بياناتك المتعلقة بك بشكل نهائي من قواعد بياناتنا.</Typography>
                    </li>
                    <li>
                        <Typography variant="body2">تسجيل خروجك من التطبيق فور حذف الحساب.</Typography>
                    </li>
                </Box>

                {/* قسم أمان بياناتك */}
                <Typography variant="h5" align="center" style={{ margin: '20px 0', color: '#1976d2' }}>
                    🔒 أمان بياناتك
                </Typography>
                <Typography variant="body1" align="center" style={{ margin: '10px 0' }}>
                    نلتزم بحماية خصوصيتك، ونسعى لجعل تجربتك آمنة.
                </Typography>

                <Typography variant="h6" style={{ margin: '20px 0' }}>
                    📍 البيانات التي نجمعها:
                </Typography>
                <Box component="ul" sx={{ paddingRight: 2 }}>
                    <li>
                        <Typography variant="body2">*الموقع الجغرافي* (اختياري): لتحسين الخدمات المقدمة.</Typography>
                    </li>
                    <li>
                        <Typography variant="body2">*البريد الإلكتروني* (مطلوب): لتسجيل الدخول وإرسال التحديثات.</Typography>
                    </li>
                    <li>
                        <Typography variant="body2">*المدينة المقيم بها حاليا*</Typography>
                    </li>
                    <li>
                        <Typography variant="body2">*رقم الجوال* (اختياري)</Typography>
                    </li>
                </Box>

                <Typography variant="h6" style={{ margin: '20px 0' }}>
                    🔐 كيف نحمي بياناتك؟
                </Typography>
                <Box component="ul" sx={{ paddingRight: 2 }}>
                    <li>
                        <Typography variant="body2">نستخدم تشفير AES-256 لنقل البيانات.</Typography>
                    </li>
                    <li>
                        <Typography variant="body2">لا نشارك بياناتك مع جهات خارجية إلا للضرورة (مثل مزودي الدفع).</Typography>
                    </li>
                </Box>

                <Typography variant="h6" style={{ margin: '20px 0' }}>
                    📜 سياسة الخصوصية
                </Typography>
  
                <Box textAlign="center" marginTop={2}>
                    <Button variant="contained" color="error" href="/privacypolicy">
                        قراءة سياسة الخصوصية الخاصة بالتطبيق
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default DeleteAccount;
