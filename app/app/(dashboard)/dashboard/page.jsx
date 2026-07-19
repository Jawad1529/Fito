'use client';

import { useRouter } from 'next/navigation';
import { Typography, Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import useLocalStorageState from '@/hooks/useLocalStorageState';
import ConsultationSummaryCard from '@/components/organisms/dashboard/ConsultationSummaryCard';
import ConversationPanel from '@/components/organisms/dashboard/ConversationPanel';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const router = useRouter();
  const [consultation] = useLocalStorageState('fito_consultation', null);

  return (
    <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <Title level={2} className="!text-white !mb-2">
          Query Dashboard
        </Title>
        <Paragraph className="!text-gray-400 mb-8">
          Track the status of your consultation and chat with your dietitian.
        </Paragraph>

        {consultation === null && (
          <div className="bg-white/5 border border-white/10 rounded-3xl py-16">
            <Empty
              description={
                <span className="text-gray-400">
                  You haven&apos;t submitted a consultation yet.
                </span>
              }
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push('/consultation')}
              >
                Start a Consultation
              </Button>
            </Empty>
          </div>
        )}

        {consultation && (
          <>
            <ConsultationSummaryCard consultation={consultation} />
            <ConversationPanel />
          </>
        )}

      </div>
    </div>
  );
}
