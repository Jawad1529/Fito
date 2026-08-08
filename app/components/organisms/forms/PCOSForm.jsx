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

export default function PCOSForm({
  formData,
  updateGoalData,
}) {
  const goalData = formData.goalData || {};

  return (
    <div className="space-y-6!">

      {/* Medical Information */}

      <Card className="glass border border-border-light">

        <H4 className="mb-5">
          Medical Information (طبی معلومات)
        </H4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Field label="Have you been diagnosed with PCOS? (کیا آپ کو پی سی او ایس کی تشخیص ہوئی ہے؟)">
            <Radio.Group
              value={goalData.diagnosed}
              onChange={(e)=>
                updateGoalData("diagnosed", e.target.value)
              }
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
              <Radio value="unsure">Not Sure</Radio>
            </Radio.Group>
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
            <Field label="Current Medication (موجودہ ادویات)">
              <Input
                value={goalData.medication}
                onChange={(e)=>
                  updateGoalData(
                    "medication",
                    e.target.value
                  )
                }
                placeholder="Metformin, Inositol, etc."
              />
            </Field>
          </div>

        </div>

      </Card>

      {/* Symptoms */}

      <Card className="glass border border-border-light">

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
            "Weight Gain",
            "Irregular Periods",
            "Acne",
            "Hair Loss",
            "Excess Facial Hair",
            "Fatigue",
            "Mood Swings",
            "Difficulty Losing Weight",
          ]}
        />

      </Card>

      {/* Menstrual Cycle */}

      <Card className="glass border border-border-light">

        <H4 className="mb-5">
          Menstrual Cycle (ماہواری کا سائیکل)
        </H4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Field label="Cycle Regularity (سائیکل کی باقاعدگی)">
            <Select
              value={goalData.cycle}
              onChange={(value)=>
                updateGoalData("cycle", value)
              }
              options={[
                {
                  label:"Regular",
                  value:"regular"
                },
                {
                  label:"Irregular",
                  value:"irregular"
                },
                {
                  label:"Very Irregular",
                  value:"very-irregular"
                }
              ]}
            />
          </Field>

          <Field label="Last Period (آخری ماہواری)">
            <DatePicker
              value={goalData.lastPeriod}
              onChange={(date)=>
                updateGoalData(
                  "lastPeriod",
                  date?.toISOString()
                )
              }
            />
          </Field>

        </div>

      </Card>

      {/* Lifestyle */}

      <Card className="glass border border-border-light">

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

      <Card className="glass border border-border-light">

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
            "Weight Loss",
            "Hormone Balance",
            "Improve Fertility",
            "Reduce Symptoms",
            "Healthy Lifestyle",
          ]}
        />

      </Card>

      {/* Notes */}

      <Card className="glass border border-border-light">

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
