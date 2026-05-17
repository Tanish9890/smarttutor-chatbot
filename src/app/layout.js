import "./globals.css";
import SmartTutorAIChatbot from "../components/SmartTutorAIChatbot";

export const metadata = {
  title: "Smart Tutor",
  description: "Smart Tutor Education Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SmartTutorAIChatbot />
      </body>
    </html>
  );
}