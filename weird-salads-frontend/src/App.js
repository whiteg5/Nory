import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FrontOfHouseSales from './FrontOfHouseSales'; // Import the FrontOfHouseSales component
import HomePage from './HomePage'; // Adjust the import if necessary
import InventoryManager from './InventoryManager'; // Import the InventoryManager component
import Navbar from './Navbar'; // Import Navbar

function App() {
    return (
        <div>
            <Navbar />  {/* Add Navbar here */}
            <Routes>
                <Route path="/inventory-manager" element={<InventoryManager />} />
                <Route path="/front-of-house-sales" element={<FrontOfHouseSales />} /> {/* Add this line */}
                <Route path="/" element={<HomePage />} /> {/* Assuming you have a HomePage component */}
            </Routes>
        </div>
    );
}

export default App;
