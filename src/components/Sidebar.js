import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Initial Details', path: '/registration/initial', key: 'initialDetails' },
    { name: 'Personal Details', path: '/registration/personal', key: 'personalDetails' },
    { name: 'Contact Details', path: '/registration/Contact', key: 'contactDetails' },
    { name: 'Tax Details', path: '/registration/fatca', key: 'fatcaDetails' },
    { name: 'Bank Details', path: '/registration/bank', key: 'bankDetails' },
    { name: 'Employment Details', path: '/registration/employment', key: 'employmentDetails' },
    { name: 'Scheme Selection', path: '/registration/scheme', key: 'schemeDetails' },
    { name: 'Nominee Details', path: '/registration/nomination', key: 'nomineeDetails' },
    { name: 'Photo & Signature', path: '/registration/photo-signature', key: 'uploadDetails' },
  ];

  const isCompleted = (storageKey) => !!localStorage.getItem(storageKey);

  // A tab is enabled if:
  //  - it's the very first tab, OR
  //  - every previous tab has its storage key (i.e., previous steps completed), OR
  //  - this tab itself is already completed (allow going back).
  const isTabEnabled = (index) => {
    if (index === 0) return true;
    const tab = tabs[index];
    if (isCompleted(tab.key)) return true;
    // all previous tabs must be completed
    for (let i = 0; i < index; i++) {
      if (!isCompleted(tabs[i].key)) return false;
    }
    return true;
  };

  const handleClick = (tab, index) => {
    if (!isTabEnabled(index)) {
      // optionally show a toast or visual cue here
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
              <span className="tab-label">{tab.name}</span>

              <span className="tab-status" aria-hidden>
                {completed ? (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="white" d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
                  </svg>
                ) : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
