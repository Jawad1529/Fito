'use client';

import Card from '../../atoms/Card';
import { H4 } from '../../atoms/Typography';
import InputNumber from '../../atoms/InputNumber';
import Select from '../../atoms/Select';
import Slider from '../../atoms/Slider';
import Checkbox from '../../atoms/Checkbox';
import TextArea from '../../atoms/TextArea';

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-text-secondary font-medium">{label}</label>
    {children}
  </div>
);

export default function BodyRecompositionForm({
  formData,
  updateGoalData,
}) {
  const goalData = formData.goalData || {};

  return (
    <div className="space-y-6!">

      {/* Goals */}
      <Card className="bg-surface border border-border">
        <H4 className="mb-5">Body Goals</H4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Target Weight (kg)">
            <InputNumber
              value={goalData.targetWeight}
              onChange={(value) =>
                updateGoalData("targetWeight", value)
              }
            />
          </Field>

          <Field label="Estimated Body Fat % (Optional)">
            <InputNumber
              min={5}
              max={60}
              value={goalData.bodyFat}
              onChange={(value) =>
                updateGoalData("bodyFat", value)
              }
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Waist Circumference (cm)">
              <InputNumber
                value={goalData.waist}
                onChange={(value) =>
                  updateGoalData("waist", value)
                }
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Training */}
      <Card className="bg-surface border border-border">
        <H4 className="mb-5">Training</H4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Field label="Workout Days / Week">
            <Slider
              min={1}
              max={7}
              value={goalData.workoutDays}
              onChange={(value) =>
                updateGoalData("workoutDays", value)
              }
            />
          </Field>

          <Field label="Cardio Sessions / Week">
            <Slider
              min={0}
              max={7}
              value={goalData.cardioDays}
              onChange={(value) =>
                updateGoalData("cardioDays", value)
              }
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Training Experience">
              <Select
                value={goalData.experience}
                onChange={(value) =>
                  updateGoalData("experience", value)
                }
                options={[
                  { label: "Beginner", value: "beginner" },
                  { label: "Intermediate", value: "intermediate" },
                  { label: "Advanced", value: "advanced" },
                ]}
              />
            </Field>
          </div>

        </div>
      </Card>

      {/* Nutrition */}
      <Card className="bg-surface border border-border">
        <H4 className="mb-5">Nutrition</H4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Field label="Meals Per Day">
            <Select
              value={goalData.meals}
              onChange={(value) =>
                updateGoalData("meals", value)
              }
              options={[
                { label: "2", value: 2 },
                { label: "3", value: 3 },
                { label: "4", value: 4 },
                { label: "5+", value: 5 },
              ]}
            />
          </Field>

          <Field label="Protein Intake (g/day)">
            <InputNumber
              value={goalData.protein}
              onChange={(value) =>
                updateGoalData("protein", value)
              }
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Current Challenges">
              <Checkbox.Group
                className="flex flex-col gap-3"
                value={goalData.challenges}
                onChange={(value) =>
                  updateGoalData("challenges", value)
                }
                options={[
                  "Hard to lose fat",
                  "Hard to build muscle",
                  "Inconsistent workouts",
                  "Poor diet",
                  "Lack of motivation",
                ]}
              />
            </Field>
          </div>

        </div>
      </Card>

      {/* Lifestyle */}
      <Card className="bg-surface border border-border">
        <H4 className="mb-5">Lifestyle</H4>

        <div className="grid grid-cols-1 gap-5">

          <Field label="Sleep (Hours)">
            <Slider
              min={3}
              max={12}
              value={goalData.sleep}
              onChange={(value) =>
                updateGoalData("sleep", value)
              }
            />
          </Field>

          <Field label="Additional Notes">
            <TextArea
              rows={4}
              value={goalData.notes || ''}
              onChange={(e) =>
                updateGoalData("notes", e.target.value)
              }
              placeholder="Anything you'd like us to know?"
            />
          </Field>

        </div>
      </Card>

    </div>
  );
}
