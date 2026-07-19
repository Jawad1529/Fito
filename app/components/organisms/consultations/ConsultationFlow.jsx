'use client';

import { useRef, useEffect } from 'react';

import useConsultation from '../../../hooks/useConsultation';
import { CONSULTATION_GOALS } from '../../../utils/consultationConfig';

import GoalSelection from './GoalSelection';

import PersonalInfoStep from '../../organisms/steps/PersonalInfoStep';
import GoalSpecificStep from '../../organisms/steps/GoalSpecificStep';
import PhotoUploadStep from '../../organisms/steps/PhotoUploadStep';
import PaymentStep from '../../organisms/steps/PaymentStep';
import SuccessStep from '../../organisms/steps/SuccessStep';

import ConsultationStepper from './ConsultationStepper';
 import NavigationButtons from './NavigationButtons';

export default function ConsultationFlow() {
  const consultation = useConsultation();

  const flowRef = useRef(null);
  const isFirstRender = useRef(true);

  const {
    currentStep,
    selectedGoal,
    formData,
    setSelectedGoal,
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

  const steps = [
    <GoalSelection
      key="goal"
      goals={CONSULTATION_GOALS}
      selectedGoal={selectedGoal}
      onSelect={setSelectedGoal}
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
    />,

    <SuccessStep key="success" />,
  ];

  const isSuccessStep = currentStep === steps.length - 1;
  // Payment is the last step with a Next/Submit button — Success is a
  // read-only screen reached only after a successful submit.
  const isFinalFormStep = currentStep === steps.length - 2;

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
      if (success) next();
      return;
    }

    next();
  };

  return (
    <div ref={flowRef} className="max-w-4xl mx-auto">

      <ConsultationStepper
        currentStep={currentStep}
      />

      <div className="mt-8 bg-surface border border-border rounded-3xl p-5 sm:p-6 md:p-8">

        {steps[currentStep]}

      </div>

      {!isSuccessStep && (
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length - 1}
          isSubmitting={isSubmitting}
          onNext={handleNext}
          onPrevious={previous}
        />
      )}

    </div>
  );
}