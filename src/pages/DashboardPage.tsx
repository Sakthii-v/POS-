import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Dashboard } from './Dashboard';

export const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};
