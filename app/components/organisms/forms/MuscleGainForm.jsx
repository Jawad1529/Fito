'use client';

import {
  Card,
  Typography,
  Row,
  Col,
  Select,
  Slider,
  Input,
  InputNumber,
  Radio,
} from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function MuscleGainForm({
  formData,
  updateGoalData,
}) {
  const goalData = formData.goalData || {};

  return (
    <div className="space-y-6">

      {/* Goal */}
      <Card className="bg-white/5 border-white/10">
        <Title level={4}>Muscle Building Goal</Title>

        <Row gutter={[20, 20]}>
          <Col xs={24} md={12}>
            <Text>Target Weight (kg)</Text>

            <InputNumber
              className="w-full"
              value={goalData.targetWeight}
              onChange={(value) =>
                updateGoalData("targetWeight", value)
              }
            />
          </Col>

          <Col xs={24} md={12}>
            <Text>Primary Goal</Text>

            <Radio.Group
              className="w-full"
              value={goalData.primaryGoal}
              onChange={(e) =>
                updateGoalData("primaryGoal", e.target.value)
              }
            >
              <Radio value="lean-muscle">Lean Muscle</Radio>
              <Radio value="strength">Strength</Radio>
              <Radio value="bulk">Bulk Up</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      {/* Training */}
      <Card className="bg-white/5 border-white/10">
        <Title level={4}>Training</Title>

        <Row gutter={[20,20]}>

          <Col xs={24} md={12}>
            <Text>Training Experience</Text>

            <Select
              className="w-full"
              value={goalData.trainingExperience}
              onChange={(value)=>
                updateGoalData("trainingExperience", value)
              }
              options={[
                { label: "Beginner", value: "beginner" },
                { label: "Intermediate", value: "intermediate" },
                { label: "Advanced", value: "advanced" },
              ]}
            />
          </Col>

          <Col xs={24} md={12}>
            <Text>Workout Days / Week</Text>

            <Slider
              min={1}
              max={7}
              value={goalData.workoutDays}
              onChange={(value)=>
                updateGoalData("workoutDays", value)
              }
            />
          </Col>

          <Col span={24}>
            <Text>Do you have gym access?</Text>

            <Select
              className="w-full"
              value={goalData.gymAccess}
              onChange={(value)=>
                updateGoalData("gymAccess", value)
              }
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
                { label: "Home Gym", value: "home" },
              ]}
            />
          </Col>

        </Row>
      </Card>

      {/* Nutrition */}
      <Card className="bg-white/5 border-white/10">

        <Title level={4}>Nutrition</Title>

        <Row gutter={[20,20]}>

          <Col xs={24} md={12}>
            <Text>Meals Per Day</Text>

            <Select
              className="w-full"
              value={goalData.mealsPerDay}
              onChange={(value)=>
                updateGoalData("mealsPerDay", value)
              }
              options={[
                { label: "2", value: 2 },
                { label: "3", value: 3 },
                { label: "4", value: 4 },
                { label: "5+", value: 5 },
              ]}
            />
          </Col>

          <Col xs={24} md={12}>
            <Text>Protein Intake (g/day)</Text>

            <InputNumber
              className="w-full"
              value={goalData.protein}
              onChange={(value)=>
                updateGoalData("protein", value)
              }
            />
          </Col>

          <Col span={24}>
            <Text>Water Intake (Litres)</Text>

            <Slider
              min={1}
              max={6}
              step={0.5}
              value={goalData.water}
              onChange={(value)=>
                updateGoalData("water", value)
              }
            />
          </Col>

        </Row>

      </Card>

      {/* Recovery */}
      <Card className="bg-white/5 border-white/10">

        <Title level={4}>Recovery</Title>

        <Row gutter={[20,20]}>

          <Col span={24}>
            <Text>Sleep (Hours)</Text>

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
            <Text>Any Previous Injuries?</Text>

            <TextArea
              rows={4}
              value={goalData.injuries}
              onChange={(e)=>
                updateGoalData(
                  "injuries",
                  e.target.value
                )
              }
              placeholder="Optional"
            />
          </Col>

        </Row>

      </Card>

    </div>
  );
}