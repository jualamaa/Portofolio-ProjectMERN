import api from './api';

export const adminService = {
    getDashboard: async () => {
        const { data } = await api.get('/admin/dashboard');
        return data.data;
    },

    updateProfile: async (formData) => {
        const { data } = await api.put('/admin/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    // Projects
    getProjects: async () => {
        const { data } = await api.get('/admin/projects');
        return data.data;
    },
    getProjectById: async (id) => {
        const { data } = await api.get(`/admin/projects/${id}`);
        return data.data;
    },
    createProject: async (formData) => {
        const { data } = await api.post('/admin/projects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },
    updateProject: async (id, formData) => {
        const { data } = await api.put(`/admin/projects/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },
    deleteProject: async (id) => {
        const { data } = await api.delete(`/admin/projects/${id}`);
        return data;
    },

    // Certificates
    getCertificates: async () => {
        const { data } = await api.get('/admin/certificates');
        return data.data;
    },
    getCertificateById: async (id) => {
        const { data } = await api.get(`/admin/certificates/${id}`);
        return data.data;
    },
    createCertificate: async (formData) => {
        const { data } = await api.post('/admin/certificates', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },
    updateCertificate: async (id, formData) => {
        const { data } = await api.put(`/admin/certificates/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },
    deleteCertificate: async (id) => {
        const { data } = await api.delete(`/admin/certificates/${id}`);
        return data;
    },

    // Categories
    getCategories: async () => {
        const { data } = await api.get('/admin/categories');
        return data.data;
    },
    createCategory: async (payload) => {
        const { data } = await api.post('/admin/categories', payload);
        return data;
    },
    updateCategory: async (id, payload) => {
        const { data } = await api.put(`/admin/categories/${id}`, payload);
        return data;
    },
    deleteCategory: async (id) => {
        const { data } = await api.delete(`/admin/categories/${id}`);
        return data;
    },

    // Skills
    getSkills: async () => {
        const { data } = await api.get('/admin/skills');
        return data.data;
    },
    createSkill: async (payload) => {
        const { data } = await api.post('/admin/skills', payload);
        return data;
    },
    updateSkill: async (id, payload) => {
        const { data } = await api.put(`/admin/skills/${id}`, payload);
        return data;
    },
    deleteSkill: async (id) => {
        const { data } = await api.delete(`/admin/skills/${id}`);
        return data;
    },

    // Messages
    getMessages: async (status = 'all') => {
        const { data } = await api.get('/admin/messages', { params: { status } });
        return data.data;
    },
    getMessageById: async (id) => {
        const { data } = await api.get(`/admin/messages/${id}`);
        return data.data;
    },
    updateMessageStatus: async (id, status) => {
        const { data } = await api.patch(`/admin/messages/${id}/status`, { status });
        return data;
    },
    deleteMessage: async (id) => {
        const { data } = await api.delete(`/admin/messages/${id}`);
        return data;
    },
};