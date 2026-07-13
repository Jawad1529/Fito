import { ConfigProvider } from 'antd';
import Background from '@/components/layouts/Background';

// Ant Design dark theme (same as consultation)
const antTheme = {
  token: {
    colorPrimary: '#facc15',
    colorBgBase: '#000000',
    colorTextBase: '#ffffff',
    colorBorder: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    fontFamily: 'inherit',
  },
  components: {
    Button: {
      colorPrimary: '#facc15',
      colorPrimaryHover: '#fde047',
      colorText: '#ffffff',
    },
    Input: {
      colorBgContainer: 'rgba(255,255,255,0.05)',
      colorBorder: 'rgba(255,255,255,0.15)',
      colorText: '#ffffff',
    },
    Form: {
      labelColor: 'rgba(255,255,255,0.7)',
    },
  },
};

export default function AuthLayout({ children }) {
  return (
    <ConfigProvider theme={antTheme}>
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative">
        <Background />
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 sm:p-10 shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}