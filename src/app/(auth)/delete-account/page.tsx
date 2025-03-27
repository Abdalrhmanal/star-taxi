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
                        <Typography variant="body2">افتح تطبيقنا وتوجه إلى صفحة البروفايل.</Typography>
                        <img src="/images/step1.png" alt="الخطوة 1" style={{ maxWidth: '100%', borderRadius: '8px',height:'600px' }} />
                    </li>
                    <li>
                        <Typography variant="body2">اختر خيار "حذف الحساب".</Typography>
                        <img src="/images/step2.png" alt="الخطوة 3" style={{ maxWidth: '100%', borderRadius: '8px' ,height:'600px'}} />
                    </li>
                    <li>
                        <Typography variant="body2">قم بتأكيد عملية الحذف من خلال النقر على زر التأكيد في الواجهة المنبثقة.</Typography>
                        <img src="/images/step3.png" alt="الخطوة 4" style={{ maxWidth: '100%', borderRadius: '8px',height:'600px' }} />
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
