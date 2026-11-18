import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import CertificatesPage from '../pages/CertificatesPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';

import ProtectedAdminRoute from './ProtectedAdminRoute';
import AdminLoginPage from '../admin/pages/AdminLoginPage';
import AdminLayout from '../admin/layouts/AdminLayout';
import AdminDashboardPage from '../admin/pages/AdminDashboardPage';
import AdminProfilePage from '../admin/pages/AdminProfilePage';
import AdminProjectsPage from '../admin/pages/AdminProjectsPage';
import AdminProjectFormPage from '../admin/pages/AdminProjectFormPage';
import AdminCertificatesPage from '../admin/pages/AdminCertificatesPage';
import AdminCertificateFormPage from '../admin/pages/AdminCertificateFormPage';
import AdminCategoriesPage from '../admin/pages/AdminCategoriesPage';
import AdminSkillsPage from '../admin/pages/AdminSkillsPage';
import AdminMessagesPage from '../admin/pages/AdminMessagesPage';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin CMS Routes */}
            <Route element={<ProtectedAdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="profile" element={<AdminProfilePage />} />
                    <Route path="projects" element={<AdminProjectsPage />} />
                    <Route path="projects/create" element={<AdminProjectFormPage />} />
                    <Route path="projects/edit/:id" element={<AdminProjectFormPage />} />
                    <Route path="certificates" element={<AdminCertificatesPage />} />
                    <Route path="certificates/create" element={<AdminCertificateFormPage />} />
                    <Route path="certificates/edit/:id" element={<AdminCertificateFormPage />} />
                    <Route path="categories" element={<AdminCategoriesPage />} />
                    <Route path="skills" element={<AdminSkillsPage />} />
                    <Route path="messages" element={<AdminMessagesPage />} />
                </Route>
            </Route>
        </Routes>
    );
}