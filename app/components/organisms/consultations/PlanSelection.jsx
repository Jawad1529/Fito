'use client';

import { CheckCircleFilled, CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';

import Card from '../../atoms/Card';
import Image from '../../atoms/Image';
import { H2, H3, Text, Caption } from '../../atoms/Typography';

function formatPrice(price) {
  return `Rs. ${price.toLocaleString('en-US')}`;
}

function formatDuration(months) {
  return `${months} Month${months > 1 ? 's' : ''}`;
}

export default function PlanSelection({
  goal,
  plans,
  selectedPlan,
  onSelect,
}) {
  return (
    <div>

      <div className="text-center mb-10">
        <H2 className="mb-2">
          Choose your plan{goal ? ` for ${goal.title}` : ''}
        </H2>

        <Text muted>
          Here&apos;s what&apos;s included and what it costs — pick the duration that works for you.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {plans.map((plan) => {

          const isSelected = selectedPlan?.id === plan.id;
          const hasDiscount = plan.discountPercent > 0;
          const chargedPrice = plan.discountedPrice ?? plan.price;

          return (
            <Card
              key={plan.id}
              hoverable
              padding={0}
              onClick={() => onSelect(plan)}
              className={`
                relative
                overflow-hidden
                border
                flex flex-col

                ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border-light glass hover:border-primary/40'
                }
              `}
            >
              {isSelected && (
                <CheckCircleFilled
                  className="absolute top-3 right-3 z-10 text-primary text-xl bg-surface rounded-full"
                />
              )}

              {plan.badge && (
                <span className="absolute top-3 left-3 z-10 text-xs font-semibold px-2 py-1 rounded-full bg-primary text-text-inverse">
                  {plan.badge}
                </span>
              )}

              <div className="relative w-full aspect-square">
                <Image
                  src={plan.image || goal?.image}
                  alt={`${plan.label} plan reference`}
                  fill
                  objectFit="contain"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                {/* Tier name is fully admin-controlled (see the admin panel's
                    "Manage Pricing" page) — shown exactly as entered. */}
                {plan.label && (
                  <span className="absolute bottom-3 left-4 z-10 text-white text-2xl font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {plan.label}
                  </span>
                )}
              </div>

              <div className="p-6 flex flex-col grow">

                <Caption>{formatDuration(plan.durationMonths)}</Caption>

                <div className="flex items-center gap-2 mt-1 mb-1">
                  <H3 className="m-0">
                    {formatPrice(chargedPrice)}
                  </H3>
                  {hasDiscount && (
                    <>
                      <Text muted className="line-through">
                        {formatPrice(plan.price)}
                      </Text>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">
                        {plan.discountPercent}% off
                      </span>
                    </>
                  )}
                </div>

                <Text muted className="mb-4">
                  {formatPrice(Math.round(chargedPrice / plan.durationMonths))} / month
                </Text>

                {plan.bestFor && (
                  <div className="flex items-start gap-2 bg-overlay rounded-lg p-3 mb-4">
                    <InfoCircleOutlined className="text-primary mt-0.5 text-sm shrink-0" />
                    <Text className="text-sm">{plan.bestFor}</Text>
                  </div>
                )}

                <ul className="space-y-2 mt-auto">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckOutlined className="text-primary mt-1 text-xs shrink-0" />
                      <Text className="text-sm">{feature}</Text>
                    </li>
                  ))}
                </ul>

              </div>

            </Card>
          );
        })}

      </div>

    </div>
  );
}
