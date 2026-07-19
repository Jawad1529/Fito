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

export default function FatLossForm({
  formData,
  updateGoalData,
}) {

  const goalData = formData.goalData || {};

  return (
    <div className="space-y-6!">

      {/* Current Body */}
      <Card className="bg-surface border border-border">

        <H4 className="mb-5">Current Body</H4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Field label="Current Weight (kg)">
            <InputNumber
              value={goalData.currentWeight}
              onChange={(value)=>
                updateGoalData("currentWeight", value)
              }
            />
          </Field>

          <Field label="Target Weight (kg)">
            <InputNumber
              value={goalData.targetWeight}
              onChange={(value)=>
                updateGoalData("targetWeight", value)
              }
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Waist Size (cm)">
              <InputNumber
                value={goalData.waist}
                onChange={(value)=>
                  updateGoalData("waist", value)
                }
              />
            </Field>
          </div>

        </div>

      </Card>

      {/* Lifestyle */}

      <Card className="bg-surface border border-border">

        <H4 className="mb-5">Lifestyle</H4>

        <div className="grid grid-cols-1 gap-5">

          <Field label="Daily Activity Level">
            <Select
              value={goalData.activity}
              onChange={(value)=>
                updateGoalData("activity", value)
              }
              options={[
                {
                  label:"Sedentary",
                  value:"sedentary"
                },
                {
                  label:"Light",
                  value:"light"
                },
                {
                  label:"Moderate",
                  value:"moderate"
                },
                {
                  label:"Very Active",
                  value:"active"
                }
              ]}
            />
          </Field>

          <Field label="Sleep (Hours)">
            <Slider
              min={3}
              max={12}
              value={goalData.sleep}
              onChange={(value)=>
                updateGoalData("sleep", value)
              }
            />
          </Field>

          <Field label="Water Intake (Litres)">
            <Slider
              min={1}
              max={6}
              step={0.5}
              value={goalData.water}
              onChange={(value)=>
                updateGoalData("water", value)
              }
            />
          </Field>

        </div>

      </Card>

      {/* Eating Habits */}

      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Eating Habits
        </H4>

        <div className="grid grid-cols-1 gap-5">

          <Field label="Meals Per Day">
            <Select
              value={goalData.meals}
              onChange={(value)=>
                updateGoalData("meals", value)
              }
              options={[
                {label:"2",value:2},
                {label:"3",value:3},
                {label:"4",value:4},
                {label:"5+",value:5},
              ]}
            />
          </Field>

          <Field label="Biggest Challenges">
            <Checkbox.Group
              className="flex flex-col gap-3"
              value={goalData.challenges}
              onChange={(value)=>
                updateGoalData("challenges", value)
              }
              options={[
                "Sugar cravings",
                "Late-night eating",
                "Busy schedule",
                "Emotional eating",
                "Frequent dining out",
              ]}
            />
          </Field>

          <Field label="Previous Diets">
            <TextArea
              rows={4}
              value={goalData.previousDiets || ''}
              onChange={(e)=>
                updateGoalData(
                  "previousDiets",
                  e.target.value
                )
              }
            />
          </Field>

        </div>

      </Card>

    </div>
  );
}
