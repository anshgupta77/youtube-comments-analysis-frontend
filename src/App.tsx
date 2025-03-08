import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FormPage from './Pages/FormPage';
import DashboardPage from './Pages/DashboardPage';

const App: React.FC = () => {
  return (
    <div className='App w-full h-full'>
      <Router>
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

    </div>
  );
};

export default App;
