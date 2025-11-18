import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/BankDetails.css';

const BankDetails = () => {
  const navigate = useNavigate();

  // ---------- FORM STATE ----------
  const [form, setForm] = useState({
    sameAsTier1: '',
    // Tier 1
    tier1_accountType: '',
    tier1_bankAccountNumber: '',
    tier1_bankIfsCode: '',
    tier1_bankName: '',
    tier1_linkedToAdhaarFlag: '',
    tier1_cancelledChqFlag: '',
    tier1_pennyDropVerf: '',
    tier1_numberOfNominee: '',
    tier1_numberOfSchema: '',
    tier1_salaryAccDeclarationFlag: '',
    // Tier 2
    tier2_accountType: '',
    tier2_bankAccountNumber: '',
    tier2_bankIfsCode: '',
    tier2_bankName: '',
    tier2_linkedToAdhaarFlag: '',
    tier2_cancelledChqFlag: '',
    tier2_pennyDropVerf: '',
    tier2_numberOfNominee: '',
    tier2_numberOfSchema: '',
    tier2_salaryAccDeclarationFlag: ''
  });

  const [errors, setErrors] = useState({});

  // ---------- VALIDATION ----------
  const validateField = useCallback(
    (name, value) => {
      const newErr = { ...errors };
      delete newErr[name];

      // Same as Tier 1
      if (name === 'sameAsTier1' && value && !['Y', 'N'].includes(value)) {
        newErr[name] = 'Must be Y or N';
      }

      // Tier 1 - Mandatory
      if (name === 'tier1_accountType') {
        if (!value) newErr[name] = 'Account Type is required';
        else if (value.length > 20) newErr[name] = 'Max 20 characters';
      }

      if (name === 'tier1_bankAccountNumber') {
        if (!value) newErr[name] = 'Bank Account Number is required';
        else if (value.length < 3 || value.length > 30) newErr[name] = '3–30 characters';
        else if (value.includes(' ')) newErr[name] = 'Spaces not allowed';
        else if (!/^[a-zA-Z0-9]+$/.test(value)) newErr[name] = 'Alphanumeric only';
        else if (/^0+$/.test(value)) newErr[name] = 'All zeros not allowed';
        else if (/^[a-zA-Z]+$/.test(value)) newErr[name] = 'All alphabets not allowed';
      }

      if (name === 'tier1_bankIfsCode') {
        if (!value) newErr[name] = 'IFS Code is required';
        else if (value.length < 8 || value.length > 11) newErr[name] = '8–11 characters';
        else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
  newErr[name] = 'Invalid IFSC: format should be HDFC0001234';
}

      }

      if (name === 'tier1_bankName' && value && value.length > 75) {
        newErr[name] = 'Max 75 characters';
      }

      if (name === 'tier1_linkedToAdhaarFlag' && value && !['Y', 'N'].includes(value)) {
        newErr[name] = 'Must be Y or N';
      }

      if (name === 'tier1_cancelledChqFlag') {
        if (!value) newErr[name] = 'Cancelled Cheque Flag is required';
        else if (!['Y', 'N'].includes(value)) newErr[name] = 'Must be Y or N';
      }

      if (name === 'tier1_pennyDropVerf') {
        if (!value) newErr[name] = 'Penny Drop Verification is required';
        else if (!['Y', 'N'].includes(value)) newErr[name] = 'Must be Y or N';
      }

      if (name === 'tier1_numberOfNominee') {
        if (!value) newErr[name] = 'Number of Nominee is required';
        else if (!['1', '2', '3'].includes(value)) newErr[name] = 'Must be 1, 2, or 3';
      }

      if (name === 'tier1_numberOfSchema') {
        if (!value) newErr[name] = 'Number of Schema is required';
        else if (!/^[1-4]$/.test(value)) newErr[name] = 'Must be 1–4';
      }

      if (name === 'tier1_salaryAccDeclarationFlag' && value && !['Y', ''].includes(value)) {
        newErr[name] = 'Must be Y or blank';
      }

      // Tier 2 - Optional, but validate if filled
      if (name === 'tier2_accountType' && value && value.length > 20) newErr[name] = 'Max 20 characters';
      if (name === 'tier2_bankAccountNumber' && value) {
        if (value.includes(' ')) newErr[name] = 'Spaces not allowed';
        else if (value.length > 30 || !/^[a-zA-Z0-9]*$/.test(value)) newErr[name] = 'Max 30 alphanumeric';
        else if (/^0+$/.test(value)) newErr[name] = 'All zeros not allowed';
        else if (/^[a-zA-Z]+$/.test(value)) newErr[name] = 'All alphabets not allowed';
      }
      if (name === 'tier2_bankIfsCode' && value) {
        if (value.length < 8 || value.length > 11) newErr[name] = '8–11 characters';
        else if (!/^[a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2,5}$/.test(value)) {
          newErr[name] = 'Invalid format: 4 letters + 2 letters + 2-5 alphanumeric';
        }
      }
      if (name === 'tier2_bankName' && value && value.length > 75) newErr[name] = 'Max 75 characters';
      if (name === 'tier2_linkedToAdhaarFlag' && value && !['Y', 'N'].includes(value)) newErr[name] = 'Must be Y or N';
      if (name === 'tier2_cancelledChqFlag' && value && !['Y', 'N'].includes(value)) newErr[name] = 'Must be Y or N';
      if (name === 'tier2_pennyDropVerf' && value && !['Y', 'N'].includes(value)) newErr[name] = 'Must be Y or N';
      if (name === 'tier2_numberOfNominee' && value && !['1', '2', '3'].includes(value)) newErr[name] = 'Must be 1, 2, or 3';
      if (name === 'tier2_numberOfSchema' && value && !/^[1-4]$/.test(value)) newErr[name] = 'Must be 1–4';
      if (name === 'tier2_salaryAccDeclarationFlag' && value && !['Y', ''].includes(value)) newErr[name] = 'Must be Y or blank';

      setErrors(newErr);
    },
    [errors]
  );

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);

    // Auto-copy Tier 1 to Tier 2 if "Same as Tier 1" = Y
    if (name === 'sameAsTier1' && value === 'Y') {
      setForm((prev) => ({
        ...prev,
        tier2_accountType: prev.tier1_accountType,
        tier2_bankAccountNumber: prev.tier1_bankAccountNumber,
        tier2_bankIfsCode: prev.tier1_bankIfsCode,
        tier2_bankName: prev.tier1_bankName,
        tier2_linkedToAdhaarFlag: prev.tier1_linkedToAdhaarFlag,
        tier2_cancelledChqFlag: prev.tier1_cancelledChqFlag,
        tier2_pennyDropVerf: prev.tier1_pennyDropVerf,
        tier2_numberOfNominee: prev.tier1_numberOfNominee,
        tier2_numberOfSchema: prev.tier1_numberOfSchema,
        tier2_salaryAccDeclarationFlag: prev.tier1_salaryAccDeclarationFlag
      }));
    }
  };

  // ---------- FULL FORM VALIDATION ----------
  const validateAll = () => {
    const mandatory = [
      'tier1_accountType',
      'tier1_bankAccountNumber',
      'tier1_bankIfsCode',
      'tier1_cancelledChqFlag',
      'tier1_pennyDropVerf',
      'tier1_numberOfNominee',
      'tier1_numberOfSchema'
    ];

    const newErr = {};
    mandatory.forEach((f) => {
      if (!form[f]) newErr[f] = 'Required';
    });

    Object.keys(form).forEach(field => validateField(field, form[field]));

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  // ---------- OUTPUT JSON ----------
  const getOutputJSON = () => ({
    sameAsTier1: form.sameAsTier1 || '',
    tier1: {
      accountType: form.tier1_accountType,
      bankAccountNumber: form.tier1_bankAccountNumber,
      bankIfsCode: form.tier1_bankIfsCode,
      bankName: form.tier1_bankName || '',
      linkedToAdhaarFlag: form.tier1_linkedToAdhaarFlag || '',
      cancelledChqFlag: form.tier1_cancelledChqFlag,
      pennyDropVerf: form.tier1_pennyDropVerf || 'N',
      numberOfNominee: form.tier1_numberOfNominee,
      numberOfSchema: form.tier1_numberOfSchema,
      salaryAccDeclarationFlag: form.tier1_salaryAccDeclarationFlag || ''
    },
    tier2: {
      accountType: form.tier2_accountType || '',
      bankAccountNumber: form.tier2_bankAccountNumber || '',
      bankIfsCode: form.tier2_bankIfsCode || '',
      bankName: form.tier2_bankName || '',
      linkedToAdhaarFlag: form.tier2_linkedToAdhaarFlag || '',
      cancelledChqFlag: form.tier2_cancelledChqFlag || '',
      pennyDropVerf: form.tier2_pennyDropVerf || '',
      numberOfNominee: form.tier2_numberOfNominee || '',
      numberOfSchema: form.tier2_numberOfSchema || '',
      salaryAccDeclarationFlag: form.tier2_salaryAccDeclarationFlag || ''
    }
  });

  // ---------- BUTTON HANDLERS ----------
  const handleNext = () => {
    if (validateAll()) {
      const payload = getOutputJSON();
      localStorage.setItem('bankDetails', JSON.stringify(payload));
      navigate('/registration/employment');
    }
  };

  const handleBack = () => {
    navigate('/registration/fatca');
  };

  // ---------- RENDER ----------
  return (
    <div className="app-main">
      <section className="form-card">
        <h2>Registration – Bank Details</h2>

        {/* Bank Options */}
        <div className="form-section">
          <h3>Bank Options</h3>
          <div className="form-grid">
            <label className={`form-field${errors.sameAsTier1 ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">Same as Tier 1</span>
                <select
                  className="form-input"
                  value={form.sameAsTier1}
                  onChange={(e) => handleChange('sameAsTier1', e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
              {errors.sameAsTier1 && <span className="error-text">{errors.sameAsTier1}</span>}
            </label>
          </div>
        </div>

        {/* Tier 1 Bank Details */}
        <div className="form-section">
          <h3>Tier 1 Bank Details</h3>
          <div className="form-grid">

            <label className={`form-field${errors.tier1_accountType ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">Account Type <span className="required">*</span></span>
                <input
                  type="text"
                  className="form-input"
                  value={form.tier1_accountType}
                  onChange={(e) => handleChange('tier1_accountType', e.target.value)}
                  placeholder="e.g. Savings"
                />
              </div>
              {errors.tier1_accountType && <span className="error-text">{errors.tier1_accountType}</span>}
            </label>

            <label className={`form-field${errors.tier1_bankAccountNumber ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">Bank Account Number <span className="required">*</span></span>
                <input
                  type="text"
                  className="form-input"
                  value={form.tier1_bankAccountNumber}
                  onChange={(e) => handleChange('tier1_bankAccountNumber', e.target.value)}
                  placeholder="e.g. 1234567890"
                />
              </div>
              {errors.tier1_bankAccountNumber && <span className="error-text">{errors.tier1_bankAccountNumber}</span>}
            </label>

            <label className={`form-field${errors.tier1_bankIfsCode ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">IFS Code <span className="required">*</span></span>
                <input
                  type="text"
                  className="form-input"
                  value={form.tier1_bankIfsCode}
                  onChange={(e) => handleChange('tier1_bankIfsCode', e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001234"
                  maxLength={11}
                />
              </div>
              {errors.tier1_bankIfsCode && <span className="error-text">{errors.tier1_bankIfsCode}</span>}
            </label>

            <label className={`form-field${errors.tier1_bankName ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">Bank Name</span>
                <input
                  type="text"
                  className="form-input"
                  value={form.tier1_bankName}
                  onChange={(e) => handleChange('tier1_bankName', e.target.value)}
                />
              </div>
              {errors.tier1_bankName && <span className="error-text">{errors.tier1_bankName}</span>}
            </label>

            <label className={`form-field${errors.tier1_linkedToAdhaarFlag ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">Linked to Aadhaar</span>
                <select
                  className="form-input"
                  value={form.tier1_linkedToAdhaarFlag}
                  onChange={(e) => handleChange('tier1_linkedToAdhaarFlag', e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
              {errors.tier1_linkedToAdhaarFlag && <span className="error-text">{errors.tier1_linkedToAdhaarFlag}</span>}
            </label>

            <label className={`form-field${errors.tier1_cancelledChqFlag ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">Cancelled Cheque <span className="required">*</span></span>
                <select
                  className="form-input"
                  value={form.tier1_cancelledChqFlag}
                  onChange={(e) => handleChange('tier1_cancelledChqFlag', e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
              {errors.tier1_cancelledChqFlag && <span className="error-text">{errors.tier1_cancelledChqFlag}</span>}
            </label>

            <label className={`form-field${errors.tier1_pennyDropVerf ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">Penny Drop Verification <span className="required">*</span></span>
                <select
                  className="form-input"
                  value={form.tier1_pennyDropVerf}
                  onChange={(e) => handleChange('tier1_pennyDropVerf', e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  <option value="Y">Verified</option>
                  <option value="N">Not Verified</option>
                </select>
              </div>
              {errors.tier1_pennyDropVerf && <span className="error-text">{errors.tier1_pennyDropVerf}</span>}
            </label>

            <label className={`form-field${errors.tier1_numberOfNominee ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">Number of Nominees <span className="required">*</span></span>
                <select
                  className="form-input"
                  value={form.tier1_numberOfNominee}
                  onChange={(e) => handleChange('tier1_numberOfNominee', e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              {errors.tier1_numberOfNominee && <span className="error-text">{errors.tier1_numberOfNominee}</span>}
            </label>

            <label className={`form-field${errors.tier1_numberOfSchema ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">Number of Schemes <span className="required">*</span></span>
                <input
                  type="text"
                  className="form-input"
                  value={form.tier1_numberOfSchema}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^1-4]/g, '').slice(0, 1);
                    handleChange('tier1_numberOfSchema', v);
                  }}
                  placeholder="1–4"
                  maxLength={1}
                />
              </div>
              {errors.tier1_numberOfSchema && <span className="error-text">{errors.tier1_numberOfSchema}</span>}
            </label>

            <label className={`form-field${errors.tier1_salaryAccDeclarationFlag ? ' has-error' : ''}`}>
              <div className="form-field-content">
                <span className="form-label">Salary Account</span>
                <select
                  className="form-input"
                  value={form.tier1_salaryAccDeclarationFlag}
                  onChange={(e) => handleChange('tier1_salaryAccDeclarationFlag', e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  <option value="Y">Yes</option>
                </select>
              </div>
              {errors.tier1_salaryAccDeclarationFlag && <span className="error-text">{errors.tier1_salaryAccDeclarationFlag}</span>}
            </label>

          </div>
        </div>

        {/* Tier 2 Bank Details */}
        <div className="form-section">
          <h3>Tier 2 Bank Details {form.sameAsTier1 === 'Y' && <span className="info-text">(Same as Tier 1)</span>}</h3>
          <div className="form-grid">

           {[
  { key: 'tier2_accountType', label: 'Account Type' },
  { key: 'tier2_bankAccountNumber', label: 'Bank Account Number' },
  { key: 'tier2_bankIfsCode', label: 'IFS Code' },
  { key: 'tier2_bankName', label: 'Bank Name' },
  { key: 'tier2_linkedToAdhaarFlag', label: 'Linked to Aadhaar', type: 'select', options: ['Y', 'N'] },
  { key: 'tier2_cancelledChqFlag', label: 'Cancelled Cheque', type: 'select', options: ['Y', 'N'] },
  { key: 'tier2_pennyDropVerf', label: 'Penny Drop Verification', type: 'select', options: ['Y', 'N'] },
  { key: 'tier2_numberOfNominee', label: 'Number of Nominees', type: 'select', options: ['1', '2', '3'] },
  { key: 'tier2_numberOfSchema', label: 'Number of Schemes', type: 'number' },
  { key: 'tier2_salaryAccDeclarationFlag', label: 'Salary Account', type: 'select', options: ['Y'] }
].map((field) => {

              const isSelect = field.type === 'select';
              const isNumber = field.type === 'number';

              return (
                <label
                  key={field.key}
                  className={`form-field${errors[field.key] ? ' has-error' : ''}`}
                >
                  <div className="form-field-content">
                    <span className="form-label">{field.label}</span>
                    {isSelect ? (
                      <select
                        className="form-input"
                        value={form[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        disabled={form.sameAsTier1 === 'Y'}
                      >
                        <option value="" disabled>Select</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt === 'Y' ? 'Yes' : opt === 'N' ? 'No' : opt}</option>
                        ))}
                      </select>
                    ) : isNumber ? (
                      <input
                        type="text"
                        className="form-input"
                        value={form[field.key]}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^1-4]/g, '').slice(0, 1);
                          handleChange(field.key, v);
                        }}
                        disabled={form.sameAsTier1 === 'Y'}
                        placeholder="1–4"
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        value={form[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        disabled={form.sameAsTier1 === 'Y'}
                      />
                    )}
                  </div>
                  {errors[field.key] && <span className="error-text">{errors[field.key]}</span>}
                </label>
              );
            })}

          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="action-button secondary" onClick={handleBack}>
            Back
          </button>
          <button
            type="button"
            className={`action-button${
              Object.keys(errors).length > 0 || 
              !form.tier1_accountType || 
              !form.tier1_bankAccountNumber || 
              !form.tier1_bankIfsCode || 
              !form.tier1_cancelledChqFlag || 
              !form.tier1_pennyDropVerf || 
              !form.tier1_numberOfNominee || 
              !form.tier1_numberOfSchema
                ? ' disabled' : ' primary'
            }`}
            onClick={handleNext}
            disabled={
              Object.keys(errors).length > 0 || 
              !form.tier1_accountType || 
              !form.tier1_bankAccountNumber || 
              !form.tier1_bankIfsCode || 
              !form.tier1_cancelledChqFlag || 
              !form.tier1_pennyDropVerf || 
              !form.tier1_numberOfNominee || 
              !form.tier1_numberOfSchema
            }
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default BankDetails;