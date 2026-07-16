import { ConfigProvider } from 'antd';
import Background from '@/components/layouts/Background';
import { antTheme } from '@/lib/antTheme';

export default function AuthLayout({ children }) {
  return (
    <ConfigProvider theme={antTheme}>
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative">
        <Background />
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-overlay backdrop-blur-lg rounded-3xl p-8 sm:p-10 shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
