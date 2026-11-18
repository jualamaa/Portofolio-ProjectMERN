import api from './api';

export const portfolioService = {
    getProfile: async () => {
        const { data } = await api.get('/profile');
        return data.data;
    },

    getProjects: async (params = {}) => {
        const { data } = await api.get('/projects', { params });
        return data;
    },

    getProjectBySlug: async (slug) => {
        const { data } = await api.get(`/projects/${slug}`);
        return data.data;
    },

    getCertificates: async (params = {}) => {
        const { data } = await api.get('/certificates', { params });
        return data;
    },

    getCategories: async (type) => {
        const { data } = await api.get('/categories', { params: type ? { type } : {} });
        return data.data;
    },

    getSkills: async () => {
        const { data } = await api.get('/skills');
        return data.data;
    },
};