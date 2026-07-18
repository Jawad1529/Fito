'use client';

import {
  Input,
  Select,
  DatePicker,
  Slider,
  Typography,
  Row,
  Col,
} from 'antd';

import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function PersonalInfoStep({
  formData,
  updateField,
}) {

  return (
    <div>

      <Title level={3} className="!text-white">
        Personal Information
      </Title>

      <Text className="!text-gray-400 block mb-8">
        Tell us a little about yourself.
      </Text>

      <Row gutter={[20,20]}>

        <Col xs={24} md={12}>
          <Text className="text-gray-300">Full Name</Text>

          <Input
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e)=>updateField("fullName",e.target.value)}
          />
        </Col>

        <Col xs={24} md={12}>
          <Text>Email</Text>

          <Input
            placeholder="john@email.com"
            value={formData.email}
            onChange={(e)=>updateField("email",e.target.value)}
          />
        </Col>

        <Col xs={24} md={12}>
          <Text>Phone Number</Text>

          <Input
            placeholder="+92..."
            value={formData.phone}
            onChange={(e)=>updateField("phone",e.target.value)}
          />
        </Col>

        <Col xs={24} md={12}>
          <Text>Date of Birth</Text>

          <DatePicker
            className="w-full"
            value={
              formData.dob
                ? dayjs(formData.dob)
                : null
            }
            onChange={(date)=>
              updateField(
                "dob",
                date?.toISOString()
              )
            }
          />
        </Col>

        <Col xs={24} md={12}>
          <Text>Gender</Text>

          <Select
            className="w-full"
            value={formData.gender}
            onChange={(value)=>updateField("gender",value)}
            options={[
              {label:"Male",value:"male"},
              {label:"Female",value:"female"},
              {label:"Other",value:"other"},
            ]}
          />
        </Col>

        <Col xs={24} md={12}>
          <Text>Activity Level</Text>

          <Select
            className="w-full"
            value={formData.activityLevel}
            onChange={(value)=>updateField("activityLevel",value)}
            options={[
              {
                label:"Sedentary",
                value:"sedentary",
              },
              {
                label:"Lightly Active",
                value:"light",
              },
              {
                label:"Moderately Active",
                value:"moderate",
              },
              {
                label:"Very Active",
                value:"active",
              },
            ]}
          />
        </Col>

      </Row>

      <div className="mt-10">

        <Title level={5} className="!text-white">
          Height
        </Title>

        <Slider
          min={120}
          max={220}
          value={formData.height}
          onChange={(value)=>updateField("height",value)}
        />

        <Input
          type="number"
          suffix="cm"
          value={formData.height}
          onChange={(e)=>
            updateField(
              "height",
              Number(e.target.value)
            )
          }
        />

      </div>

      <div className="mt-8">

        <Title level={5} className="!text-white">
          Weight
        </Title>

        <Slider
          min={30}
          max={200}
          value={formData.weight}
          onChange={(value)=>updateField("weight",value)}
        />

        <Input
          type="number"
          suffix="kg"
          value={formData.weight}
          onChange={(e)=>
            updateField(
              "weight",
              Number(e.target.value)
            )
          }
        />

      </div>

    </div>
  );
}