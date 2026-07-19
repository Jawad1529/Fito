'use client';

import { CheckCircleFilled } from '@ant-design/icons';

import Card from '../../atoms/Card';
import { H2, H3, Text } from '../../atoms/Typography';

export default function GoalSelection({
  goals,
  selectedGoal,
  onSelect,
}) {
  return (
    <div>

      <div className="text-center mb-10">
        <H2 className="mb-2">
          What would you like help with?
        </H2>

        <Text muted>
          Choose your primary goal so we can personalize your consultation.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {goals.map((goal) => {

          const isSelected = selectedGoal === goal.id;

          return (
            <Card
              key={goal.id}
              hoverable
              padding={28}
              onClick={() => onSelect(goal.id)}
              className={`
                relative
                overflow-hidden
                border

                ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-surface hover:border-primary/40'
                }
              `}
            >
              {isSelected && (
                <CheckCircleFilled
                  className="absolute top-5 right-5 text-primary text-xl"
                />
              )}

              <div className="text-5xl mb-5">
                {goal.icon}
              </div>

              <H3 className="mb-3">
                {goal.title}
              </H3>

              <Text muted>
                {goal.shortDescription}
              </Text>

            </Card>
          );
        })}

      </div>

    </div>
  );
}
