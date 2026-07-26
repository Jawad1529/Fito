'use client';

import Card from '../../atoms/Card';
import { H4 } from '../../atoms/Typography';
import Select from '../../atoms/Select';
import Slider from '../../atoms/Slider';
import Input from '../../atoms/Input';
import DatePicker from '../../atoms/DatePicker';
import Checkbox from '../../atoms/Checkbox';
import Radio from '../../atoms/Radio';
import TextArea from '../../atoms/TextArea';

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-text-secondary font-medium">{label}</label>
    {children}
  </div>
);

export default function DiabetesForm({
  formData,
  updateGoalData,
}) {
  const goalData = formData.goalData || {};

  return (
    <div className="space-y-6!">

      {/* Medical Information */}

      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Medical Information (طبی معلومات)
        </H4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Field label="Diabetes Type (ذیابیطس کی قسم)">
            <Select
              value={goalData.diabetesType}
              onChange={(value)=>
                updateGoalData("diabetesType", value)
              }
              options={[
                {
                  label:"Type 1",
                  value:"type-1"
                },
                {
                  label:"Type 2",
                  value:"type-2"
                },
                {
                  label:"Prediabetes",
                  value:"prediabetes"
                },
                {
                  label:"Gestational",
                  value:"gestational"
                }
              ]}
            />
          </Field>

          <Field label="Diagnosis Date (تشخیص کی تاریخ)">
            <DatePicker
              value={goalData.diagnosisDate}
              onChange={(date)=>
                updateGoalData(
                  "diagnosisDate",
                  date?.toISOString()
                )
              }
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Current Medication / Insulin (موجودہ ادویات / انسولین)">
              <Input
                value={goalData.medication}
                onChange={(e)=>
                  updateGoalData(
                    "medication",
                    e.target.value
                  )
                }
                placeholder="Metformin, Insulin, etc."
              />
            </Field>
          </div>

        </div>

      </Card>

      {/* Blood Sugar Levels */}

      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Blood Sugar Levels (بلڈ شوگر لیول)
        </H4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Field label="Fasting Blood Sugar (mg/dL) (فاسٹنگ بلڈ شوگر)">
            <Input
              type="number"
              value={goalData.fastingSugar}
              onChange={(e)=>
                updateGoalData(
                  "fastingSugar",
                  e.target.value
                )
              }
              placeholder="e.g. 110"
            />
          </Field>

          <Field label="Post-Meal Blood Sugar (mg/dL) (کھانے کے بعد بلڈ شوگر)">
            <Input
              type="number"
              value={goalData.postMealSugar}
              onChange={(e)=>
                updateGoalData(
                  "postMealSugar",
                  e.target.value
                )
              }
              placeholder="e.g. 160"
            />
          </Field>

          <Field label="Latest HbA1c (%) (تازہ ترین ایچ بی اے ون سی)">
            <Input
              type="number"
              value={goalData.hba1c}
              onChange={(e)=>
                updateGoalData(
                  "hba1c",
                  e.target.value
                )
              }
              placeholder="e.g. 6.5"
            />
          </Field>

        </div>

      </Card>

      {/* Symptoms */}

      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Symptoms (علامات)
        </H4>

        <Checkbox.Group
          className="flex flex-col gap-3"
          value={goalData.symptoms}
          onChange={(value)=>
            updateGoalData("symptoms", value)
          }
          options={[
            "Frequent Urination",
            "Excessive Thirst",
            "Fatigue",
            "Blurred Vision",
            "Slow-Healing Wounds",
            "Tingling in Hands/Feet",
            "Unexplained Weight Loss",
          ]}
        />

      </Card>

      {/* Lifestyle */}

      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Lifestyle (طرز زندگی)
        </H4>

        <div className="grid grid-cols-1 gap-5">

          <Field label="Exercise Days / Week (ورزش کے دن / ہفتہ)">
            <Slider
              min={0}
              max={7}
              value={goalData.exercise}
              onChange={(value)=>
                updateGoalData("exercise", value)
              }
            />
          </Field>

          <Field label="Sleep (Hours) (نیند کے گھنٹے)">
            <Slider
              min={3}
              max={12}
              value={goalData.sleep}
              onChange={(value)=>
                updateGoalData("sleep", value)
              }
            />
          </Field>

          <Field label="Stress Level (ذہنی دباؤ کی سطح)">
            <Slider
              min={1}
              max={10}
              value={goalData.stress}
              onChange={(value)=>
                updateGoalData("stress", value)
              }
            />
          </Field>

        </div>

      </Card>

      {/* Goals */}

      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Consultation Goals (مشاورت کے اہداف)
        </H4>

        <Checkbox.Group
          className="flex flex-col gap-3"
          value={goalData.goals}
          onChange={(value)=>
            updateGoalData("goals", value)
          }
          options={[
            "Better Blood Sugar Control",
            "Weight Management",
            "Reduce Medication Dependency",
            "Prevent Complications",
            "Healthy Lifestyle",
          ]}
        />

      </Card>

      {/* Notes */}

      <Card className="bg-surface border border-border">

        <H4 className="mb-5">
          Additional Notes (اضافی نوٹس)
        </H4>

        <TextArea
          rows={5}
          value={goalData.notes || ''}
          onChange={(e)=>
            updateGoalData(
              "notes",
              e.target.value
            )
          }
          placeholder="Tell us anything that will help us understand your condition better..."
        />

      </Card>

    </div>
  );
}
