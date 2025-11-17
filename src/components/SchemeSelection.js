import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SchemeSelection.css';

const SchemeSelection = () => {
  const navigate = useNavigate();

  // ---------- FORM STATE ----------
  const [schemeOption, setSchemeOption] = useState(''); // 'auto' or 'active'
  const [lifeCycleFund, setLifeCycleFund] = useState('');
  const [funds, setFunds] = useState([
    { type: 'Equity', percentage: '' },
    { type: 'Corporate Bonds', percentage: '' },
    { type: 'Government Securities', percentage: '' }
  ]);
  const [pmfNumber, setPmfNumber] = useState('');
  const [errors, setErrors] = useState({});

  // ---------- REAL-TIME TOTAL ----------
  const totalPercentage = funds.reduce((sum, fund) => {
    const val = parseFloat(fund.percentage) || 0;
    return sum + val;
  }, 0);

  // ---------- VALIDATION ----------
  const validateAll = useCallback(() => {
    const newErr = {};
  
    if (!schemeOption) {
      newErr.schemeOption = 'Please select an investment option';
    }
  
    if (schemeOption === 'auto' && !lifeCycleFund) {
      newErr.lifeCycleFund = 'Please select a Life Cycle Fund';
    }
  
    if (schemeOption === 'active') {
      if (!pmfNumber.trim()) {
        newErr.pmfNumber = 'PMF Number is required';
      }
      if (totalPercentage !== 100) {
        newErr.total = 'Total percentage must be exactly 100%';
      }
      funds.forEach((fund, idx) => {
        const val = parseFloat(fund.percentage) || 0;
        if (val < 0 || val > 100) {
          newErr[`fund_${idx}`] = 'Percentage must be 0–100';
        }
      });
    }
  
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  }, [schemeOption, lifeCycleFund, pmfNumber, funds, totalPercentage]);
  
  // Validate on change
  useEffect(() => {
    validateAll();
  }, [validateAll]);

  // ---------- HANDLE FUND CHANGE ----------
  const handleFundChange = (index, value) => {
    const num = value.replace(/\D/g, '').slice(0, 3);
    const newFunds = [...funds];
    newFunds[index].percentage = num;
    setFunds(newFunds);
  };

  // ---------- OUTPUT JSON ----------
  const getOutputJSON = () => ({
    schemeOption,
    lifeCycleFund: schemeOption === 'auto' ? lifeCycleFund : null,
    pmfNumber: schemeOption === 'active' ? pmfNumber : null,
    fundAllocations: schemeOption === 'active' ? funds : null
  });

  // ---------- BUTTON HANDLERS ----------
  const handleNext = () => {
    if (validateAll()) {
      const payload = getOutputJSON();
      localStorage.setItem('schemeDetails', JSON.stringify(payload));
      navigate('/registration/nomination');
    }
  };

  const handleBack = () => {
    navigate('/registration/employment');
  };

  // ---------- RENDER ----------
  return (
    <div className="app-main">
      <section className="form-card">
        <h2>Registration – Scheme Selection</h2>

        {/* Investment Scheme (Tier 1) */}
        <div className="form-section">
          <h3>Investment Scheme (Tier 1)</h3>

          {/* Scheme Option */}
          <div className="form-field">
            <span className="form-label">
              Choose your investment option <span className="required">*</span>
            </span>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="schemeOption"
                  value="auto"
                  checked={schemeOption === 'auto'}
                  onChange={() => setSchemeOption('auto')}
                />
                <span>Auto Choice</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="schemeOption"
                  value="active"
                  checked={schemeOption === 'active'}
                  onChange={() => setSchemeOption('active')}
                />
                <span>Active Choice</span>
              </label>
            </div>
            {errors.schemeOption && <span className="error-text">{errors.schemeOption}</span>}
          </div>

          {/* Auto Choice */}
          {schemeOption === 'auto' && (
            <div className="conditional-section">
              <h4>Auto Choice</h4>
              <label className={`form-field${errors.lifeCycleFund ? ' has-error' : ''}`}>
                <span className="form-label">Select Life Cycle Fund</span>
                <select
                  className="form-input"
                  value={lifeCycleFund}
                  onChange={(e) => setLifeCycleFund(e.target.value)}
                >
                  <option value="" disabled>Select Fund</option>
                  <option value="B">B - Balanced Life Cycle</option>
                  <option value="A">A - Aggressive Life Cycle</option>
                  <option value="C">C - Conservative Life Cycle</option>
                </select>
                {errors.lifeCycleFund && <span className="error-text">{errors.lifeCycleFund}</span>}
              </label>
              <p className="info-text">
                This choice will automatically allocate your funds across E, C, G.
              </p>
            </div>
          )}

          {/* Active Choice */}
          {schemeOption === 'active' && (
            <div className="conditional-section">
              <h4>Active Choice</h4>

              {/* PMF Number */}
              <label className={`form-field${errors.pmfNumber ? ' has-error' : ''}`}>
                <span className="form-label">PMF Number</span>
                <input
                  type="text"
                  className="form-input"
                  value={pmfNumber}
                  onChange={(e) => setPmfNumber(e.target.value)}
                  placeholder="Enter PMF Number"
                />
                {errors.pmfNumber && <span className="error-text">{errors.pmfNumber}</span>}
              </label>

              {/* Fund Allocation Table */}
              <div className="fund-table">
                <div className="table-header">
                  <span>Fund Type</span>
                  <span>Percentage %</span>
                </div>
                {funds.map((fund, idx) => (
                  <div key={idx} className="table-row">
                    <input
                      type="text"
                      value={fund.type}
                      readOnly
                      className="form-input readonly"
                    />
                    <label className={`form-field${errors[`fund_${idx}`] ? ' has-error' : ''}`}>
                      <input
                        type="text"
                        className="form-input"
                        value={fund.percentage}
                        onChange={(e) => handleFundChange(idx, e.target.value)}
                        placeholder="0–100"
                        maxLength={3}
                      />
                      {errors[`fund_${idx}`] && <span className="error-text">{errors[`fund_${idx}`]}</span>}
                    </label>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="total-row">
                <span>Total: <strong>{totalPercentage}%</strong></span>
                {errors.total && <span className="error-text">{errors.total}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="action-button secondary" onClick={handleBack}>
            Back
          </button>
          <button
            type="button"
            className={`action-button${
              Object.keys(errors).length > 0 || !schemeOption || 
              (schemeOption === 'auto' && !lifeCycleFund) ||
              (schemeOption === 'active' && (totalPercentage !== 100 || !pmfNumber.trim()))
                ? ' disabled' : ' primary'
            }`}
            onClick={handleNext}
            disabled={
              Object.keys(errors).length > 0 || !schemeOption || 
              (schemeOption === 'auto' && !lifeCycleFund) ||
              (schemeOption === 'active' && (totalPercentage !== 100 || !pmfNumber.trim()))
            }
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default SchemeSelection;