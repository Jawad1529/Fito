'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button, Empty, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import useAuth from '@/hooks/useAuth';
import ConsultationSummaryCard from '@/components/organisms/dashboard/ConsultationSummaryCard';
import ConversationPanel from '@/components/organisms/dashboard/ConversationPanel';
import { getMyConsultations } from '@/services/consultation.service';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  // Remounts (resetting all local state) whenever auth state changes,
  // instead of syncing that reset through an effect.
  return <DashboardPageInner key={isAuthenticated} isAuthenticated={isAuthenticated} />;
}

function DashboardPageInner({ isAuthenticated }) {
  const router = useRouter();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    getMyConsultations()
      .then((data) => {
        if (!cancelled) setConsultations(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Title level={2} className="!text-white !mb-2">Query Dashboard</Title>
          <Paragraph className="!text-gray-400 mb-8">
            Sign in to track your consultation and chat with your dietitian.
          </Paragraph>
          <Button type="primary" onClick={() => router.push('/login')}>
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <Title level={2} className="!text-white !mb-2">
          Query Dashboard
        </Title>
        <Paragraph className="!text-gray-400 mb-8">
          Track the status of your consultation and chat with your dietitian.
        </Paragraph>

        {loading && (
          <div className="flex justify-center py-16">
            <Spin />
          </div>
        )}

        {!loading && consultations.length === 0 && (
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

        {!loading &&
          consultations.map((consultation) => (
            <div key={consultation.id} className="mb-8">
              <ConsultationSummaryCard consultation={consultation} />
              <div className="my-4 " >
              <ConversationPanel consultation={consultation} />
              </div>
            </div>
          ))}

      </div>
    </div>
  );
}
