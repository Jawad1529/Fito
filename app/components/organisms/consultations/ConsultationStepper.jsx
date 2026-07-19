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
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full
                  flex items-center justify-center
                  text-sm sm:text-base
                  border
                  shrink-0
                  transition-all

                  ${
                    completed || active
                    ? "bg-primary text-text-inverse border-primary"
                    : "bg-overlay text-text-muted border-border-light"
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
                    h-[2px] flex-1 mx-1.5 sm:mx-2

                    ${
                      index < currentStep
                      ? "bg-primary"
                      : "bg-overlay-medium"
                    }
                  `}
                />
              )}

            </div>
          );
        })}

      </div>


      <div className="hidden sm:flex justify-between mt-3">

        {steps.map((step)=>(
          <span
            key={step}
            className="
              text-xs
              text-text-muted
              text-center
              flex-1
            "
          >
            {step}
          </span>
        ))}

      </div>

      <div className="sm:hidden mt-3 text-center">
        <span className="text-xs font-medium text-primary">
          {steps[currentStep]}
        </span>
        <span className="text-xs text-text-muted">
          {" "}· Step {currentStep + 1} of {steps.length}
        </span>
      </div>

    </div>
  );
}