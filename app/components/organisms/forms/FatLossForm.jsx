'use client';

import {
  Card,
  Typography,
  Row,
  Col,
  InputNumber,
  Select,
  Slider,
  Checkbox,
  Input,
} from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function FatLossForm({
  formData,
  updateGoalData,
}) {

  const goalData = formData.goalData || {};

  return (
    <div className="space-y-6">

      {/* Current Body */}
      <Card className="bg-white/5 border-white/10">

        <Title level={4}>Current Body</Title>

        <Row gutter={[20,20]}>

          <Col xs={24} md={12}>
            <Text>Current Weight (kg)</Text>

            <InputNumber
              className="w-full"
              value={goalData.currentWeight}
              onChange={(value)=>
                updateGoalData("currentWeight", value)
              }
            />
          </Col>

          <Col xs={24} md={12}>
            <Text>Target Weight (kg)</Text>

            <InputNumber
              className="w-full"
              value={goalData.targetWeight}
              onChange={(value)=>
                updateGoalData("targetWeight", value)
              }
            />
          </Col>

          <Col xs={24}>
            <Text>Waist Size (cm)</Text>

            <InputNumber
              className="w-full"
              value={goalData.waist}
              onChange={(value)=>
                updateGoalData("waist", value)
              }
            />
          </Col>

        </Row>

      </Card>

      {/* Lifestyle */}

      <Card className="bg-white/5 border-white/10">

        <Title level={4}>Lifestyle</Title>

        <Row gutter={[20,20]}>

          <Col span={24}>

            <Text>Daily Activity Level</Text>

            <Select
              className="w-full"
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
              Water Intake (Litres)
            </Text>

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

      {/* Eating Habits */}

      <Card className="bg-white/5 border-white/10">

        <Title level={4}>
          Eating Habits
        </Title>

        <Row gutter={[20,20]}>

          <Col span={24}>

            <Text>Meals Per Day</Text>

            <Select
              className="w-full"
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

          </Col>

          <Col span={24}>

            <Text>Biggest Challenges</Text>

            <Checkbox.Group
              className="flex flex-col gap-3 mt-3"
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

          </Col>

          <Col span={24}>

            <Text>Previous Diets</Text>

            <TextArea
              rows={4}
              value={goalData.previousDiets}
              onChange={(e)=>
                updateGoalData(
                  "previousDiets",
                  e.target.value
                )
              }
            />

          </Col>

        </Row>

      </Card>

    </div>
  );
}