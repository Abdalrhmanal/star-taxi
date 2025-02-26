
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: {
    template: "%s | star-taxi",
    default: "star-taxi",
  },
  description: "Main layout for the star-taxi",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

      <body >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
