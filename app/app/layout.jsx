import './globals.css';
import MainLayout from '@/components/layouts/MainLayout';

export const metadata = {
  title: 'Fito',
  description: 'Premium supplements and personalized diet consultation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}