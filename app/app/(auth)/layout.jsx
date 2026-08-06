import { ConfigProvider } from 'antd';
import { antTheme } from '@/lib/antTheme';

// Background is supplied by MainLayout for every route, so this layout no
// longer renders its own — auth pages were painting two full-viewport
// decorative backdrops on top of each other.
export default function AuthLayout({ children }) {
  return (
    <ConfigProvider theme={antTheme}>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
        <div className="relative z-10 w-full max-w-md">
          <div className="glass rounded-3xl p-8 sm:p-10 shadow-2xl">{children}</div>
        </div>
      </div>
    </ConfigProvider>
  );
}
