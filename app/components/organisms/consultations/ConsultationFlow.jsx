'use client';

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

  const isLastStep = currentStep === steps.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      await submitConsultation();
      return;
    }

    next();
  };

  return (
    <div className="max-w-4xl mx-auto">

      <ConsultationStepper
        currentStep={currentStep}
      />

      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-8">

        {steps[currentStep]}

      </div>

      {currentStep !== steps.length - 1 && (
        <NavigationButtons
          currentStep={currentStep}
          isSubmitting={isSubmitting}
          onNext={handleNext}
          onPrevious={previous}
        />
      )}

    </div>
  );
}