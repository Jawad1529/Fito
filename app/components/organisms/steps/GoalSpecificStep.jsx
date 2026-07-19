'use client';

import Alert from '../../atoms/Alert';

export default function GoalSpecificStep({
  goal,
  formData,
  updateGoalData,
}) {
  if (!goal) {
    return (
      <Alert
        type="warning"
        message="Please select a consultation goal first."
      />
    );
  }

  const GoalForm = goal.component;

  return (
    <GoalForm
      formData={formData}
      updateGoalData={updateGoalData}
    />
  );
}
