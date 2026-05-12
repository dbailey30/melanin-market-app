import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import BusinessProfilePage from './components/BusinessProfilePage';
import CityPage from './components/CityPage';
import CategoryPage from './components/CategoryPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* Business profile pages: /biz/chaos-unlimited-rochester-ny */}
      <Route path="/biz/:slug" element={<BusinessProfilePage />} />

      {/* City + category landing pages: /ny/buffalo/black-owned-restaurants */}
      <Route path="/:state/:city/:category" element={<CategoryPage />} />

      {/* City landing pages: /ny/buffalo */}
      <Route path="/:state/:city" element={<CityPage />} />

      {/* Main app — all other routes */}
      <Route path="/*" element={<App />} />
    </Routes>
  );
}
