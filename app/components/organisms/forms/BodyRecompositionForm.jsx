'use client';

import {
  Card,
  Typography,
  Row,
  Col,
  Select,
  Slider,
  InputNumber,
  Input,
  Checkbox,
} from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function BodyRecompositionForm({
  formData,
  updateGoalData,
}) {
  const goalData = formData.goalData || {};

  return (
    <div className="space-y-6">

      {/* Goals */}
      <Card className="bg-white/5 border-white/10">
        <Title level={4}>Body Goals</Title>

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
            <Text>Estimated Body Fat % (Optional)</Text>

            <InputNumber
              className="w-full"
              min={5}
              max={60}
              value={goalData.bodyFat}
              onChange={(value) =>
                updateGoalData("bodyFat", value)
              }
            />
          </Col>

          <Col span={24}>
            <Text>Waist Circumference (cm)</Text>

            <InputNumber
              className="w-full"
              value={goalData.waist}
              onChange={(value) =>
                updateGoalData("waist", value)
              }
            />
          </Col>
        </Row>
      </Card>

      {/* Training */}
      <Card className="bg-white/5 border-white/10">
        <Title level={4}>Training</Title>

        <Row gutter={[20, 20]}>

          <Col xs={24} md={12}>
            <Text>Workout Days / Week</Text>

            <Slider
              min={1}
              max={7}
              value={goalData.workoutDays}
              onChange={(value) =>
                updateGoalData("workoutDays", value)
              }
            />
          </Col>

          <Col xs={24} md={12}>
            <Text>Cardio Sessions / Week</Text>

            <Slider
              min={0}
              max={7}
              value={goalData.cardioDays}
              onChange={(value) =>
                updateGoalData("cardioDays", value)
              }
            />
          </Col>

          <Col span={24}>
            <Text>Training Experience</Text>

            <Select
              className="w-full"
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
          </Col>

        </Row>
      </Card>

      {/* Nutrition */}
      <Card className="bg-white/5 border-white/10">
        <Title level={4}>Nutrition</Title>

        <Row gutter={[20, 20]}>

          <Col xs={24} md={12}>
            <Text>Meals Per Day</Text>

            <Select
              className="w-full"
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
          </Col>

          <Col xs={24} md={12}>
            <Text>Protein Intake (g/day)</Text>

            <InputNumber
              className="w-full"
              value={goalData.protein}
              onChange={(value) =>
                updateGoalData("protein", value)
              }
            />
          </Col>

          <Col span={24}>
            <Text>Current Challenges</Text>

            <Checkbox.Group
              className="flex flex-col gap-3 mt-3"
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
          </Col>

        </Row>
      </Card>

      {/* Lifestyle */}
      <Card className="bg-white/5 border-white/10">
        <Title level={4}>Lifestyle</Title>

        <Row gutter={[20, 20]}>

          <Col span={24}>
            <Text>Sleep (Hours)</Text>

            <Slider
              min={3}
              max={12}
              value={goalData.sleep}
              onChange={(value) =>
                updateGoalData("sleep", value)
              }
            />
          </Col>

          <Col span={24}>
            <Text>Additional Notes</Text>

            <TextArea
              rows={4}
              value={goalData.notes}
              onChange={(e) =>
                updateGoalData("notes", e.target.value)
              }
              placeholder="Anything you'd like us to know?"
            />
          </Col>

        </Row>
      </Card>

    </div>
  );
}