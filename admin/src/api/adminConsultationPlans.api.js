import apiClient from './client';

export const fetchConsultationPlans = async () => {
    const { data } = await apiClient.get('/admin/consultation-plans');
    return data.plans;
};

export const updateConsultationPlan = async (goal, planId, payload) => {
    const { data } = await apiClient.patch(`/admin/consultation-plans/${goal}/${planId}`, payload);
    return data.plan;
};
