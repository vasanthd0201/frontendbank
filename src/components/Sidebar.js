import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaClipboardList,
  FaUser,
  FaPhone,
  FaFileInvoiceDollar,
  FaUniversity,
  FaBriefcase,
  FaListAlt,
  FaUsers,
  FaCamera
} from 'react-icons/fa';
import '../css/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Initial Details', path: '/registration/initial', key: 'initialDetails', Icon: FaClipboardList },
    { name: 'Personal Details', path: '/registration/personal', key: 'personalDetails', Icon: FaUser },
    { name: 'Contact Details', path: '/registration/Contact', key: 'contactDetails', Icon: FaPhone },
    { name: 'Tax Details', path: '/registration/fatca', key: 'fatcaDetails', Icon: FaFileInvoiceDollar },
    { name: 'Bank Details', path: '/registration/bank', key: 'bankDetails', Icon: FaUniversity },
    { name: 'Employment Details', path: '/registration/employment', key: 'employmentDetails', Icon: FaBriefcase },
    { name: 'Scheme Selection', path: '/registration/scheme', key: 'schemeDetails', Icon: FaListAlt },
    { name: 'Nominee Details', path: '/registration/nomination', key: 'nomineeDetails', Icon: FaUsers },
    { name: 'Photo & Signature', path: '/registration/photo-signature', key: 'uploadDetails', Icon: FaCamera },
  ];

  const isCompleted = (storageKey) => !!localStorage.getItem(storageKey);

  const isTabEnabled = (index) => {
    if (index === 0) return true;
    const tab = tabs[index];
    if (isCompleted(tab.key)) return true;
    for (let i = 0; i < index; i++) {
      if (!isCompleted(tabs[i].key)) return false;
    }
    return true;
  };

  const handleClick = (tab, index) => {
    if (!isTabEnabled(index)) {
      // optional: show a toast or visual cue
      return;
    }
    navigate(tab.path);
  };

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">NPS Registration</h3>
      <ul className="tab-list">
        {tabs.map((tab, index) => {
          const active = location.pathname === tab.path;
          const completed = isCompleted(tab.key);
          const enabled = isTabEnabled(index);
          const Icon = tab.Icon;

          return (
            <li
              key={tab.path}
              role="button"
              aria-disabled={!enabled}
              tabIndex={enabled ? 0 : -1}
              onClick={() => handleClick(tab, index)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && enabled) handleClick(tab, index);
              }}
              className={`tab-item ${active ? 'active' : ''} ${completed ? 'completed' : ''} ${!enabled ? 'disabled' : ''}`}
            >
              <span className="tab-icon" aria-hidden>
                <Icon />
              </span>

              <span className="tab-label">{tab.name}</span>

              <span className="tab-status" aria-hidden>
                {completed ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden focusable="false">
                    <path fill="white" d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
                  </svg>
                ) : ''}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
