'use client';

import { Card, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function GoalSelection({
  goals,
  selectedGoal,
  onSelect,
}) {
  return (
    <div>

      <div className="text-center mb-10">
        <Title level={2} className="!text-white !mb-2">
          What would you like help with?
        </Title>

        <Paragraph className="!text-gray-400 !text-base">
          Choose your primary goal so we can personalize your consultation.
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {goals.map((goal) => {

          const isSelected = selectedGoal === goal.id;

          return (
            <Card
              key={goal.id}
              hoverable
              onClick={() => onSelect(goal.id)}
              className={`
                relative
                cursor-pointer
                rounded-2xl
                transition-all
                duration-300
                overflow-hidden
                border

                ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-white/10 bg-white/5 hover:border-yellow-400/40'
                }
              `}
              bodyStyle={{
                padding: 28,
              }}
            >
              {isSelected && (
                <CheckCircleFilled
                  className="absolute top-5 right-5 text-yellow-400 text-xl"
                />
              )}

              <div className="text-5xl mb-5">
                {goal.icon}
              </div>

              <Title
                level={3}
                className="!text-white !mb-3"
              >
                {goal.title}
              </Title>

              <Paragraph className="!text-gray-400 !mb-0">
                {goal.shortDescription}
              </Paragraph>

            </Card>
          );
        })}

      </div>

    </div>
  );
}