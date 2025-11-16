import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import InitialDetails from './components/InitialDetails';
import PersonalDetails from './components/PersonalDetails';
import ContactDetails from './components/ContactDetails';
import TaxDetails from './components/TaxDetails';
import BankDetails from './components/BankDetails';
import EmploymentDetails from './components/EmploymentDetails';
import SchemeSelection from './components/SchemeSelection';
import NomineeDetails from './components/NomineeDetails';
import PhotoSignatureForm from './components/PhotoSignatureForm';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/registration/initial" element={<InitialDetails />} />
            <Route path="/registration/personal" element={<PersonalDetails />} />
            <Route path="/registration/contact" element={<ContactDetails />} />
            <Route path="/registration/fatca" element={<TaxDetails />} />
            <Route path="/registration/bank" element={<BankDetails />} />
            <Route path="/registration/employment" element={<EmploymentDetails />} />
            <Route path="/registration/scheme" element={<SchemeSelection />} />
            <Route path="/registration/nomination" element={<NomineeDetails />} />
            <Route path="/registration/photo-signature" element={<PhotoSignatureForm />} />
            <Route path="/" element={<InitialDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;