import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import FrontOfHouseSales from './FrontOfHouseSales';
import HomePage from './HomePage';
import InventoryManager from './InventoryManager';
import Layout from './Layout';
import { LocationProvider } from './LocationContext';

function App() {
  return (
    <LocationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inventory-manager" element={<InventoryManager />} />
            <Route path="/front-of-house-sales" element={<FrontOfHouseSales />} />
          </Routes>
        </Layout>
      </Router>
    </LocationProvider>
  );
}

export default App;
