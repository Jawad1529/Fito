import FatLossForm from "../components/organisms/forms/FatLossForm";
import MuscleGainForm from "../components/organisms/forms/MuscleGainForm";
import BodyRecompositionForm from "../components/organisms/forms/BodyRecompositionForm";
import PCOSForm from "../components/organisms/forms/PCOSForm";

export const CONSULTATION_GOALS = [
  {
    id: "fat-loss",
    title: "Fat Loss",
    shortDescription: "Lose body fat with a personalized nutrition plan.",
    icon: "🔥",
    color: "#F59E0B",
    component: FatLossForm,
  },
  {
    id: "muscle-gain",
    title: "Muscle Gain",
    shortDescription: "Build lean muscle and increase strength.",
    icon: "💪",
    color: "#3B82F6",
    component: MuscleGainForm,
  },
  {
    id: "body-recomposition",
    title: "Body Recomposition",
    shortDescription: "Build muscle while reducing body fat.",
    icon: "⚖️",
    color: "#10B981",
    component: BodyRecompositionForm,
  },
  {
    id: "pcos",
    title: "PCOS",
    shortDescription: "Nutrition guidance for managing PCOS symptoms.",
    icon: "🌸",
    color: "#EC4899",
    component: PCOSForm,
  },
];