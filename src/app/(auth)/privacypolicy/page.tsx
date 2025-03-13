"use client";
import React from 'react';
import { Container, Typography, Paper } from "@mui/material";

function PrivacyPolicy() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" align="center" gutterBottom>
                Privacy Policy for Star Taxi (Star Taxi)
            </Typography>
            <Typography variant="body1" align="center" paragraph>
                Star Taxi (Star Taxi) is a private transportation company that provides transportation services for people using modern and safe cars and offers the possibility of renting a car for a specific period of time. Our motto is speed, safety and comfort.            </Typography>
            <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                    1. Information We Collect
                </Typography>
                <Typography variant="body1" paragraph>
                    When you use the Star Taxi (Star Taxi) app, we may collect the following information:
                </Typography>
                <ul>
                    <li><strong>Personal Information:</strong> Such as your name, email address, phone number, and any other information you provide during registration or while using the app.</li>
                    <li><strong>Device Information:</strong> Including device type, operating system, IP address, and unique device identifiers.</li>
                    <li><strong>Usage Data:</strong> Information about your interactions with the app, such as pages visited, time spent on the app, and actions taken.</li>
                </ul>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                    2. How We Use Your Information
                </Typography>
                <Typography variant="body1" paragraph>
                    We use the collected information for the following purposes:
                </Typography>
                <ul>
                    <li>To provide and improve the services offered through the Star Taxi (Star Taxi) app.</li>
                    <li>To communicate with you regarding updates, announcements, or changes to the app.</li>
                    <li>To analyze app usage and performance to enhance functionality and user experience.</li>
                    <li>To ensure the security and integrity of the app and its users.</li>
                </ul>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                    3. Sharing Your Information
                </Typography>
                <Typography variant="body1" paragraph>
                    Star Taxi (Star Taxi) is committed to protecting your privacy. We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:
                </Typography>
                <ul>
                    <li>With trusted service providers who assist us in operating the app and providing services to you, under strict confidentiality agreements.</li>
                    <li>When required by law or to comply with legal obligations.</li>
                    <li>To protect the rights, property, or safety of Star Taxi (Star Taxi), our users, or others.</li>
                </ul>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                    4. Data Security
                </Typography>
                <Typography variant="body1" paragraph>
                    We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                    5. Your Rights
                </Typography>
                <Typography variant="body1" paragraph>
                    You have the right to access, update, or request deletion of your personal information. To exercise these rights, please contact us at <a href="mailto:info@startaxi.org">info@startaxi.org</a>.
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                    6. Changes to This Privacy Policy
                </Typography>
                <Typography variant="body1" paragraph>
                    We may update this Privacy Policy periodically. We will notify you of any significant changes by posting the new policy on this page or through other communication methods.
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                    7. Contact Us
                </Typography>
                <Typography variant="body1" paragraph>
                    If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </Typography>
                <ul>
                    <li>Email: <a href="mailto:info@startaxi.org">info@startaxi.org</a></li>
                    <li>Phone: <a href="tel:+352681555826">+352 681 555 826</a></li>
                </ul>
            </Paper>

            <Typography variant="body1">
                Last Updated: March 12, 2025
            </Typography>
        </Container>
    );
}

export default PrivacyPolicy;