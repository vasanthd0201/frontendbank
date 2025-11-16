import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const tabs = [
    { name: 'Initial Details', path: '/registration/initial' },
    { name: 'Personal Details', path: '/registration/personal' },
    { name: 'Contact Details', path: '/registration/Contact' },
    { name: 'Tax Details', path: '/registration/fatca' },
    { name: 'Bank Details', path: '/registration/bank' },
    { name: 'Employment Details', path: '/registration/employment' },
    { name: 'Scheme Selection', path: '/registration/scheme' },
    { name: 'Nominee Details', path: '/registration/nomination' },
    { name: 'Photo & Signature', path: '/registration/photo-signature' },
  ];

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">NPS Registration</h3>
      <ul className="tab-list">
        {tabs.map((tab) => (
          <li
            key={tab.path}
            className={`tab-item ${window.location.pathname === tab.path ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
