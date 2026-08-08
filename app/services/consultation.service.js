import apiClient from './api';

// Consultation submission is multipart (personal/goal data as JSON fields
// alongside the actual photo/report/payment-screenshot files), so it can't
// be sent as a plain JSON body like the other services in this folder.
const buildFormData = ({ goal, plan, personalInfo, goalData, uploads, transactionId }) => {
  const formData = new FormData();
  formData.append('goal', goal);
  if (plan) formData.append('plan', JSON.stringify(plan));
  formData.append('personalInfo', JSON.stringify(personalInfo));
  formData.append('goalData', JSON.stringify(goalData || {}));
  if (transactionId) formData.append('transactionId', transactionId);

  (uploads.bodyPhotos || []).forEach((file) => formData.append('bodyPhotos', file));
  (uploads.reports || []).forEach((file) => formData.append('reports', file));
  (uploads.paymentScreenshot || []).forEach((file) => formData.append('paymentScreenshot', file));

  return formData;
};

// Auth required — the token is attached by the axios request interceptor.
// No explicit Content-Type here: axios sets multipart/form-data with the
// required boundary itself when the body is a FormData instance. Setting it
// manually strips the boundary and the server can't parse the body.
export const submitConsultation = async (payload) => {
  const { data } = await apiClient.post('/consultations', buildFormData(payload));
  return data.consultation;
};

export const getMyConsultations = async () => {
  const { data } = await apiClient.get('/consultations/my');
  return data.consultations;
};

export const getConsultation = async (id) => {
  const { data } = await apiClient.get(`/consultations/${id}`);
  return data.consultation;
};

export const sendConsultationMessage = async (id, message) => {
  const { data } = await apiClient.post(`/consultations/${id}/messages`, { message });
  return data.consultation;
};
