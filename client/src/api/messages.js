import api from './axios';

export const sendMessage = (data, files) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  if (files) {
    files.forEach((file) => formData.append('attachments', file));
  }
  return api.post('/messages', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const getMessages = (params) => api.get('/messages', { params });
export const getMyMessages = () => api.get('/messages/mine');
export const toggleMessageRead = (id) => api.patch(`/messages/${id}/read`);
export const replyToMessage = (id, text) => api.post(`/messages/${id}/reply`, { text });
export const deleteMessage = (id) => api.delete(`/messages/${id}`);
export const replyToMyMessage = (id, text) => api.post(`/messages/mine/${id}/reply`, { text });
export const deleteMyMessage = (id) => api.delete(`/messages/mine/${id}`);
export const updateMessageStatus = (id, status) => api.patch(`/messages/${id}/status`, { status });
