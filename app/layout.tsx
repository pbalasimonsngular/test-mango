export const metadata = {
  title: "Test Mango",
};

import { Header } from "./components";
import { roboto } from "./ui/fonts";
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={roboto.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
