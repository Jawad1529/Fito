'use client';

import { useRouter } from 'next/navigation';
import { CheckCircleFilled, HomeOutlined, FileSearchOutlined } from '@ant-design/icons';
import Button from '../../atoms/Button';
import { H2, Text } from '../../atoms/Typography';

export default function SuccessStep() {
  const router = useRouter();

  return (
    <div className="text-center py-10">

      <CheckCircleFilled className="text-6xl text-primary mb-6" />

      <H2 className="mb-3">
        Consultation Submitted!
      </H2>

      <Text muted className="max-w-md mx-auto">
        Thank you for sharing your details. Our nutritionists are reviewing
        your consultation and will get back to you with your personalized
        plan shortly.
      </Text>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Button
          size="lg"
          variant="outline"
          icon={<HomeOutlined />}
          onClick={() => router.push('/')}
        >
          Go back to Home
        </Button>

        <Button
          size="lg"
          variant="primary"
          icon={<FileSearchOutlined />}
          onClick={() => router.push('/dashboard')}
        >
          Go to Query Dashboard
        </Button>
      </div>

    </div>
  );
}
