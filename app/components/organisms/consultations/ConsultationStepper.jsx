'use client';

import { CheckOutlined } from '@ant-design/icons';

const steps = [
  "Goal",
  "Personal Info",
  "Questions",
  "Photos",
  "Payment",
  "Submit",
];

export default function ConsultationStepper({
  currentStep,
}) {
  return (
    <div className="w-full mb-10">

      <div className="flex items-center justify-between">

        {steps.map((step, index) => {

          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div
              key={step}
              className="flex items-center flex-1"
            >

              <div
                className={`
                  w-10 h-10 rounded-full
                  flex items-center justify-center
                  border
                  transition-all

                  ${
                    completed || active
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-white/5 text-gray-400 border-white/20"
                  }
                `}
              >
                {
                  completed
                    ? <CheckOutlined />
                    : index + 1
                }
              </div>


              {index !== steps.length - 1 && (
                <div
                  className={`
                    h-[2px] flex-1 mx-2

                    ${
                      index < currentStep
                      ? "bg-yellow-400"
                      : "bg-white/20"
                    }
                  `}
                />
              )}

            </div>
          );
        })}

      </div>


      <div className="flex justify-between mt-3">

        {steps.map((step)=>(
          <span
            key={step}
            className="
              text-xs
              text-gray-400
              text-center
              flex-1
            "
          >
            {step}
          </span>
        ))}

      </div>

    </div>
  );
}