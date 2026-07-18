'use client';

import { Button } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from '@ant-design/icons';

export default function NavigationButtons({
  currentStep,
  totalSteps,
  canProceed = true,
  isSubmitting = false,
  onPrevious,
  onNext,
}) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">

      <Button
        size="large"
        disabled={isFirstStep}
        icon={<ArrowLeftOutlined />}
        onClick={onPrevious}
      >
        Previous
      </Button>

      <div className="text-gray-400 text-sm">
        Step {currentStep + 1} of {totalSteps}
      </div>

      {isLastStep ? (
        <Button
          type="primary"
          size="large"
          loading={isSubmitting}
          disabled={!canProceed}
          icon={<CheckOutlined />}
          onClick={onNext}
        >
          Submit Consultation
        </Button>
      ) : (
        <Button
          type="primary"
          size="large"
          disabled={!canProceed}
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          onClick={onNext}
        >
          Continue
        </Button>
      )}
    </div>
  );
}