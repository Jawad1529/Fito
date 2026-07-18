'use client';

import {
  Card,
  Typography,
  Row,
  Col,
  Select,
  Slider,
  Input,
  DatePicker,
  Checkbox,
  Radio,
} from 'antd';

import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PCOSForm({
  formData,
  updateGoalData,
}) {
  const goalData = formData.goalData || {};

  return (
    <div className="space-y-6">

      {/* Medical Information */}

      <Card className="bg-white/5 border-white/10">

        <Title level={4}>
          Medical Information
        </Title>

        <Row gutter={[20,20]}>

          <Col xs={24} md={12}>
            <Text>Have you been diagnosed with PCOS?</Text>

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
          </Col>

          <Col xs={24} md={12}>
            <Text>Diagnosis Date</Text>

            <DatePicker
              className="w-full"
              value={
                goalData.diagnosisDate
                  ? dayjs(goalData.diagnosisDate)
                  : null
              }
              onChange={(date)=>
                updateGoalData(
                  "diagnosisDate",
                  date?.toISOString()
                )
              }
            />
          </Col>

          <Col span={24}>
            <Text>Current Medication</Text>

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
          </Col>

        </Row>

      </Card>

      {/* Symptoms */}

      <Card className="bg-white/5 border-white/10">

        <Title level={4}>
          Symptoms
        </Title>

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

      <Card className="bg-white/5 border-white/10">

        <Title level={4}>
          Menstrual Cycle
        </Title>

        <Row gutter={[20,20]}>

          <Col xs={24} md={12}>
            <Text>Cycle Regularity</Text>

            <Select
              className="w-full"
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
          </Col>

          <Col xs={24} md={12}>
            <Text>Last Period</Text>

            <DatePicker
              className="w-full"
              value={
                goalData.lastPeriod
                  ? dayjs(goalData.lastPeriod)
                  : null
              }
              onChange={(date)=>
                updateGoalData(
                  "lastPeriod",
                  date?.toISOString()
                )
              }
            />
          </Col>

        </Row>

      </Card>

      {/* Lifestyle */}

      <Card className="bg-white/5 border-white/10">

        <Title level={4}>
          Lifestyle
        </Title>

        <Row gutter={[20,20]}>

          <Col span={24}>

            <Text>
              Exercise Days / Week
            </Text>

            <Slider
              min={0}
              max={7}
              value={goalData.exercise}
              onChange={(value)=>
                updateGoalData("exercise", value)
              }
            />

          </Col>

          <Col span={24}>

            <Text>
              Sleep (Hours)
            </Text>

            <Slider
              min={3}
              max={12}
              value={goalData.sleep}
              onChange={(value)=>
                updateGoalData("sleep", value)
              }
            />

          </Col>

          <Col span={24}>

            <Text>
              Stress Level
            </Text>

            <Slider
              min={1}
              max={10}
              value={goalData.stress}
              onChange={(value)=>
                updateGoalData("stress", value)
              }
            />

          </Col>

        </Row>

      </Card>

      {/* Goals */}

      <Card className="bg-white/5 border-white/10">

        <Title level={4}>
          Consultation Goals
        </Title>

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

      <Card className="bg-white/5 border-white/10">

        <Title level={4}>
          Additional Notes
        </Title>

        <TextArea
          rows={5}
          value={goalData.notes}
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