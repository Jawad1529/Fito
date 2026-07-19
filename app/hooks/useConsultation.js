import { useState } from "react";

const INITIAL_FORM_DATA = {
  // Personal Information
  fullName: "",
  email: "",
  phone: "",
  age: null,
  gender: "",
  height: null,
  weight: null,
  city: "",
  activityLevel: "",

  // Goal
  goal: "",

  // Goal-specific answers
  goalData: {},

  // Uploads
  bodyPhotos: [],
  reports: [],
  paymentScreenshot: null,
  transactionId: "",
};

export default function useConsultation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const next = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const previous = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateGoalData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      goalData: {
        ...prev.goalData,
        [field]: value,
      },
    }));
  };

  const resetConsultation = () => {
    setCurrentStep(0);
    setSelectedGoal(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const submitConsultation = async () => {
    try {
      setIsSubmitting(true);

      const uploads = formData.uploads || {};

      const record = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}`,
        status: "pending",
        submittedAt: new Date().toISOString(),
        goal: selectedGoal,
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          activityLevel: formData.activityLevel,
          height: formData.height,
          weight: formData.weight,
        },
        goalData: formData.goalData,
        uploads: {
          bodyPhotos: (uploads.bodyPhotos || []).length,
          reports: (uploads.reports || []).length,
          paymentScreenshot: (uploads.paymentScreenshot || []).length,
        },
        transactionId: formData.transactionId,
      };

      // await consultationService.submit(record);
      localStorage.setItem("fito_consultation", JSON.stringify(record));
      localStorage.removeItem("fito_conversation");

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    selectedGoal,
    formData,
    isSubmitting,

    next,
    previous,
    goToStep,

    setSelectedGoal,

    updateField,
    updateGoalData,

    submitConsultation,
    resetConsultation,
  };
}