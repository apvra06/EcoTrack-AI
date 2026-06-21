/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EcoProvider } from './context/EcoContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import MissionsPage from './pages/MissionsPage';
import RecommendationsPage from './pages/RecommendationsPage';

export default function App() {
  return (
    <EcoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </EcoProvider>
  );
}
