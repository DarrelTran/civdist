import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/homePage';
import MapPage from '../pages/mapPage/mapPage';
import SignUpPage from '../pages/signUpPage';
import LoginPage from '../pages/loginPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/map" element={<MapPage />} />
    </Routes>
  );
};

export default AppRoutes;