'use client';

import Input from '../../atoms/Input';
import Select from '../../atoms/Select';
import DatePicker from '../../atoms/DatePicker';
import Slider from '../../atoms/Slider';
import { H3, H5, Text } from '../../atoms/Typography';

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-text-secondary font-medium">{label}</label>
    {children}
  </div>
);

export default function PersonalInfoStep({
  formData,
  updateField,
}) {

  return (
    <div>

      <H3 className="mb-2">
        Personal Information
      </H3>

      <Text muted className="mb-8">
        Tell us a little about yourself.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Field label="Full Name">
          <Input
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e)=>updateField("fullName",e.target.value)}
          />
        </Field>

        <Field label="Email">
          <Input
            placeholder="john@email.com"
            value={formData.email}
            onChange={(e)=>updateField("email",e.target.value)}
          />
        </Field>

        <Field label="Phone Number">
          <Input
            placeholder="+92..."
            value={formData.phone}
            onChange={(e)=>updateField("phone",e.target.value)}
          />
        </Field>

        <Field label="Date of Birth">
          <DatePicker
            value={formData.dob}
            onChange={(date)=>
              updateField(
                "dob",
                date?.toISOString()
              )
            }
          />
        </Field>

        <Field label="Gender">
          <Select
            value={formData.gender}
            onChange={(value)=>updateField("gender",value)}
            options={[
              {label:"Male",value:"male"},
              {label:"Female",value:"female"},
              {label:"Other",value:"other"},
            ]}
          />
        </Field>

        <Field label="Activity Level">
          <Select
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
        </Field>

      </div>

      <div className="mt-10">

        <H5 className="mb-4">
          Height
        </H5>

        <div className="flex flex-col gap-3">
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

      </div>

      <div className="mt-8">

        <H5 className="mb-4">
          Weight
        </H5>

        <div className="flex flex-col gap-3">
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

    </div>
  );
}
