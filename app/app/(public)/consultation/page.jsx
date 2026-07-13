import { ConfigProvider } from 'antd';
import ConsultationFlow from '@/components/organisms/ConsultationFlow';
import FeaturedProducts from '../../../components/organisms/FeaturedProducts';

// Ant Design dark theme overrides
const antTheme = {
  token: {
    colorPrimary: '#facc15',        // yellow
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
    Select: {
      colorBgContainer: 'rgba(255,255,255,0.05)',
      colorBorder: 'rgba(255,255,255,0.15)',
      colorText: '#ffffff',
    },
    DatePicker: {
      colorBgContainer: 'rgba(255,255,255,0.05)',
      colorBorder: 'rgba(255,255,255,0.15)',
      colorText: '#ffffff',
    },
    Upload: {
      colorBgContainer: 'rgba(255,255,255,0.05)',
      colorBorder: 'rgba(255,255,255,0.15)',
    },
    Steps: {
      colorPrimary: '#facc15',
      colorText: '#ffffff',
      colorTextSecondary: '#9ca3af',
    },
  },
};

export default function ConsultationPage() {
  return (
    <ConfigProvider theme={antTheme}>
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Start Your Personalized Consultation</h1>
          <p className="text-gray-400 text-lg mt-3 max-w-2xl mx-auto">
            Get a custom diet and supplement plan tailored to your goals – guided by our expert nutritionists.
          </p>
        </div>
        <ConsultationFlow />
        <div className="mt-20">
          <FeaturedProducts />
        </div>
      </div>
    </ConfigProvider>
  );
}