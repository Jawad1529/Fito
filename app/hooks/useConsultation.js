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

export default function useConsultation(initialGoal = null) {
  const [currentStep, setCurrentStep] = useState(initialGoal ? 1 : 0);
  const [selectedGoal, setSelectedGoal] = useState(initialGoal);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Plans are per-goal, so a plan chosen for one goal doesn't carry over
  // if the user goes back and picks a different goal.
  const chooseGoal = (goalId) => {
    setSelectedGoal(goalId);
    setSelectedPlan(null);
  };

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
    setSelectedPlan(null);
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
        plan: selectedPlan
          ? {
              id: selectedPlan.id,
              label: selectedPlan.label,
              durationMonths: selectedPlan.durationMonths,
              price: selectedPlan.price,
            }
          : null,
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
      localStorage.setItem("Fitoo_consultation", JSON.stringify(record));
      localStorage.removeItem("Fitoo_conversation");

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
    selectedPlan,
    formData,
    isSubmitting,

    next,
    previous,
    goToStep,

    setSelectedGoal: chooseGoal,
    setSelectedPlan,

    updateField,
    updateGoalData,

    submitConsultation,
    resetConsultation,
  };
}