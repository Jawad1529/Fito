'use client';

import { useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { message } from 'antd';

import useConsultation from '../../../hooks/useConsultation';
import useAuth from '../../../hooks/useAuth';
import useTestingMode from '../../../hooks/useTestingMode';
import { CONSULTATION_GOALS } from '../../../utils/consultationConfig';

import GoalSelection from './GoalSelection';
import PlanSelection from './PlanSelection';

import PersonalInfoStep from '../../organisms/steps/PersonalInfoStep';
import GoalSpecificStep from '../../organisms/steps/GoalSpecificStep';
import PhotoUploadStep from '../../organisms/steps/PhotoUploadStep';
import PaymentStep from '../../organisms/steps/PaymentStep';
import SuccessStep from '../../organisms/steps/SuccessStep';

import ConsultationStepper from './ConsultationStepper';
 import NavigationButtons from './NavigationButtons';
import Button from '../../atoms/Button';
import { H3, Text } from '../../atoms/Typography';

export default function ConsultationFlow() {
  const { isAuthenticated } = useAuth();
  const { testingMode } = useTestingMode();

  const searchParams = useSearchParams();
  const goalParam = searchParams.get('goal');
  const initialGoal = CONSULTATION_GOALS.some((goal) => goal.id === goalParam)
    ? goalParam
    : null;

  const consultation = useConsultation(initialGoal);

  const flowRef = useRef(null);
  const isFirstRender = useRef(true);

  const {
    currentStep,
    selectedGoal,
    selectedPlan,
    formData,
    setSelectedGoal,
    setSelectedPlan,
    updateField,
    updateGoalData,
    next,
    previous,
    submitConsultation,
    isSubmitting,
  } = consultation;

  const selectedGoalConfig = CONSULTATION_GOALS.find(
    (goal) => goal.id === selectedGoal
  );

  const planStepIndex = 1;

  const handleSelectGoal = (goalId) => {
    setSelectedGoal(goalId);
    next();
  };

  const steps = [
    <GoalSelection
      key="goal"
      goals={CONSULTATION_GOALS}
      selectedGoal={selectedGoal}
      onSelect={handleSelectGoal}
    />,

    <PlanSelection
      key="plan"
      goal={selectedGoalConfig}
      plans={selectedGoalConfig?.plans || []}
      selectedPlan={selectedPlan}
      onSelect={setSelectedPlan}
    />,

    <PersonalInfoStep
      key="personal"
      formData={formData}
      updateField={updateField}
    />,

    <GoalSpecificStep
      key="goal-form"
      goal={selectedGoalConfig}
      formData={formData}
      updateGoalData={updateGoalData}
    />,

    <PhotoUploadStep
      key="photos"
      formData={formData}
      updateField={updateField}
    />,

    <PaymentStep
      key="payment"
      formData={formData}
      updateField={updateField}
      selectedPlan={selectedPlan}
    />,

    <SuccessStep key="success" goal={selectedGoalConfig} plan={selectedPlan} />,
  ];

  const isSuccessStep = currentStep === steps.length - 1;
  // Payment is the last step with a Next/Submit button — Success is a
  // read-only screen reached only after a successful submit.
  const isFinalFormStep = currentStep === steps.length - 2;
  const canProceed = currentStep === planStepIndex ? !!selectedPlan : true;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!flowRef.current) return;

    const top =
      flowRef.current.getBoundingClientRect().top +
      window.scrollY -
      96; // clear the fixed navbar

    window.scrollTo({ top, behavior: 'smooth' });
  }, [currentStep]);

  const handleNext = async () => {
    if (isFinalFormStep) {
      const success = await submitConsultation();
      if (success) {
        next();
      } else {
        message.error('Something went wrong submitting your consultation. Please try again.');
      }
      return;
    }

    next();
  };

  if (!testingMode && !isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <H3>Sign in to start your consultation</H3>
        <Text muted className="mt-2">
          We tie your consultation to your account so you can track its status
          and chat with your dietitian anytime.
        </Text>
        <Link href="/login">
          <Button variant="primary" size="lg" className="mt-6">
            Log In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div ref={flowRef} className="max-w-4xl mx-auto">

      <ConsultationStepper
        currentStep={currentStep}
      />

      <div
        className="mt-8 glass border border-border-light rounded-3xl p-5 sm:p-6 md:p-8 border-t-4 shadow-xl transition-colors"
        style={{ borderTopColor: selectedGoalConfig?.color }}
      >

        {steps[currentStep]}

      </div>

      {!isSuccessStep && (
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length - 1}
          isSubmitting={isSubmitting}
          canProceed={canProceed}
          onNext={handleNext}
          onPrevious={previous}
        />
      )}

    </div>
  );
}