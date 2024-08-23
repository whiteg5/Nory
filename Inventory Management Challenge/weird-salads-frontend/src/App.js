import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import FrontOfHouseSales from './FrontOfHouseSales';
import HomePage from './HomePage';
import InventoryManager from './InventoryManager';
import Layout from './Layout';
import { LocationProvider } from './LocationContext';
import Report from './Report';

const App = () => {
  return (
    <LocationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="inventory" element={<InventoryManager />} />
            <Route path="sales" element={<FrontOfHouseSales />} />
            <Route path="reports" element={<Report />} />
          </Route>
        </Routes>
      </Router>
    </LocationProvider>
  );
};

export default App;
