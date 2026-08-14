'use client';

import { useMemo } from 'react';
import useApiResource from './useApiResource';
import useTestingMode from './useTestingMode';
import { getConsultationPlans } from '../services/consultation.service';
import { CONSULTATION_GOALS as STATIC_GOALS } from '../utils/consultationConfig';

/**
 * Merges admin-managed pricing (price/discountPercent/discountedPrice) from
 * the backend into the static goal config (labels, images, features stay
 * owned by consultationConfig.js — only pricing is overridden). Falls back to
 * the static defaults in testing mode, before the fetch resolves, or if it
 * fails, so the flow is never blocked on the network.
 */
export default function useConsultationPlans() {
  const { testingMode } = useTestingMode();

  const { data: remotePlans } = useApiResource(getConsultationPlans, [], {
    skip: testingMode,
    fallback: null,
  });

  return useMemo(() => {
    if (!remotePlans) return STATIC_GOALS;

    const byKey = new Map(remotePlans.map((plan) => [`${plan.goal}:${plan.id}`, plan]));

    return STATIC_GOALS.map((goal) => ({
      ...goal,
      plans: goal.plans.map((plan) => {
        const remote = byKey.get(`${goal.id}:${plan.id}`);
        if (!remote) return plan;
        return {
          ...plan,
          price: remote.price,
          discountPercent: remote.discountPercent,
          discountedPrice: remote.discountedPrice,
        };
      }),
    }));
  }, [remotePlans]);
}
