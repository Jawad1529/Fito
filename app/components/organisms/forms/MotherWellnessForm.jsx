'use client';

import Card from '../../atoms/Card';
import { H4 } from '../../atoms/Typography';
import Select from '../../atoms/Select';
import Slider from '../../atoms/Slider';
import Input from '../../atoms/Input';
import Checkbox from '../../atoms/Checkbox';
import Radio from '../../atoms/Radio';
import DatePicker from '../../atoms/DatePicker';
import TextArea from '../../atoms/TextArea';

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-text-secondary font-medium">{label}</label>
    {children}
  </div>
);

export default function MotherWellnessForm({
  formData,
  updateGoalData,
}) {
  const goalData = formData.goalData || {};

  return (
    <div className="space-y-6!">

      {/* Stage */}
      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Motherhood Stage
        </H4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="md:col-span-2">
            <Field label="Which stage best describes you?">
              <Radio.Group
                value={goalData.stage}
                onChange={(e) =>
                  updateGoalData("stage", e.target.value)
                }
              >
                <Radio value="pregnant">Pregnant</Radio>
                <Radio value="postpartum">Postpartum</Radio>
                <Radio value="trying-to-conceive">Trying to Conceive</Radio>
              </Radio.Group>
            </Field>
          </div>

          <Field label="Due Date / Delivery Date">
            <DatePicker
              value={goalData.stageDate}
              onChange={(date) =>
                updateGoalData(
                  "stageDate",
                  date?.toISOString()
                )
              }
            />
          </Field>

          <Field label="Number of Children">
            <Select
              value={goalData.numChildren}
              onChange={(value) =>
                updateGoalData("numChildren", value)
              }
              options={[
                { label: "This is my first", value: 0 },
                { label: "1", value: 1 },
                { label: "2", value: 2 },
                { label: "3+", value: 3 },
              ]}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Delivery Type (if applicable)">
              <Select
                value={goalData.deliveryType}
                onChange={(value) =>
                  updateGoalData("deliveryType", value)
                }
                options={[
                  { label: "Vaginal Delivery", value: "vaginal" },
                  { label: "C-Section", value: "c-section" },
                  { label: "Not Applicable Yet", value: "na" },
                ]}
              />
            </Field>
          </div>

        </div>

      </Card>

      {/* Health & Medical */}
      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Health &amp; Medical
        </H4>

        <div className="grid grid-cols-1 gap-5">

          <Field label="Breastfeeding Status">
            <Radio.Group
              value={goalData.breastfeeding}
              onChange={(e) =>
                updateGoalData("breastfeeding", e.target.value)
              }
            >
              <Radio value="exclusively">Exclusively Breastfeeding</Radio>
              <Radio value="partially">Partially Breastfeeding</Radio>
              <Radio value="not">Not Breastfeeding</Radio>
              <Radio value="na">Not Applicable</Radio>
            </Radio.Group>
          </Field>

          <Field label="Existing Conditions">
            <Checkbox.Group
              className="flex flex-col gap-3"
              value={goalData.conditions}
              onChange={(value) =>
                updateGoalData("conditions", value)
              }
              options={[
                "Gestational Diabetes",
                "Anemia",
                "Thyroid Issues",
                "High Blood Pressure",
                "None",
              ]}
            />
          </Field>

          <Field label="Current Medications / Supplements">
            <Input
              value={goalData.medications}
              onChange={(e) =>
                updateGoalData(
                  "medications",
                  e.target.value
                )
              }
              placeholder="Prenatal vitamins, iron, folic acid, etc."
            />
          </Field>

        </div>

      </Card>

      {/* Nutrition & Lifestyle */}
      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Nutrition &amp; Lifestyle
        </H4>

        <div className="grid grid-cols-1 gap-5">

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

          <Field label="Water Intake (Litres)">
            <Slider
              min={1}
              max={6}
              step={0.5}
              value={goalData.water}
              onChange={(value) =>
                updateGoalData("water", value)
              }
            />
          </Field>

          <Field label="Sleep (Hours)">
            <Slider
              min={2}
              max={12}
              value={goalData.sleep}
              onChange={(value) =>
                updateGoalData("sleep", value)
              }
            />
          </Field>

          <Field label="Current Energy Level">
            <Slider
              min={1}
              max={10}
              value={goalData.energy}
              onChange={(value) =>
                updateGoalData("energy", value)
              }
            />
          </Field>

        </div>

      </Card>

      {/* Goals */}
      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Consultation Goals
        </H4>

        <Checkbox.Group
          className="flex flex-col gap-3"
          value={goalData.goals}
          onChange={(value) =>
            updateGoalData("goals", value)
          }
          options={[
            "Post-Pregnancy Weight Loss",
            "Regain Energy",
            "Improve Milk Supply",
            "Balanced Nutrition",
            "Manage Cravings",
            "Emotional Wellbeing",
          ]}
        />

      </Card>

      {/* Notes */}
      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Additional Notes
        </H4>

        <TextArea
          rows={5}
          value={goalData.notes || ''}
          onChange={(e) =>
            updateGoalData(
              "notes",
              e.target.value
            )
          }
          placeholder="Tell us anything else that will help us support you and your baby..."
        />

      </Card>

    </div>
  );
}
