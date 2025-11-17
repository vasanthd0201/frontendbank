import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TaxDetails.css';

const TaxDetails = () => {
  const navigate = useNavigate();

  // ---------- FORM STATE ----------
  const [form, setForm] = useState({
    declarationOfFatca: '',
    fatcaDeclarationCount: '',
    usPerson: '',
    taxPayerOfCountries: '',
    amlaFlag: '',
    countryOfTaxRes: '',
    taxIdentificationNum: '',
    tinNumIssueCountry: '',
    addrOfTaxRes: '',
    citizenshipDocFlag: '',
    docValidity: '',
    reasonForNoEvidence: '',
    fatcaState: '',
    fatcaCity: '',
    zipcode: ''
  });

  const [errors, setErrors] = useState({});

  // ---------- VALIDATION ----------
  const validateField = useCallback(
    (name, value) => {
      const newErr = { ...errors };
      delete newErr[name];

      // Declaration of FATCA
      if (name === 'declarationOfFatca') {
        if (!value) newErr[name] = 'Declaration of FATCA is required';
        else if (!['Y', 'N'].includes(value)) newErr[name] = 'Must be Y or N';
      }

      if (name === 'fatcaDeclarationCount' && value && (value.length > 2 || !/^\d*$/.test(value))) {
        newErr[name] = 'Max 2 digits';
      }

      if (name === 'usPerson' && value && !['Y', 'N'].includes(value)) {
        newErr[name] = 'Must be Y or N';
      }

      if (name === 'taxPayerOfCountries' && value.length > 3) {
        newErr[name] = 'Max 3 characters';
      }

      if (name === 'amlaFlag' && value && !['Y', 'N'].includes(value)) {
        newErr[name] = 'Must be Y or N';
      }

      if (name === 'countryOfTaxRes' && value.length > 2) {
        newErr[name] = 'Max 2 characters';
      }

      if (name === 'taxIdentificationNum' && value.length > 20) {
        newErr[name] = 'Max 20 characters';
      }

      if (name === 'tinNumIssueCountry' && value.length > 2) {
        newErr[name] = 'Max 2 characters';
      }

      if (name === 'addrOfTaxRes' && value.length > 50) {
        newErr[name] = 'Max 50 characters';
      }

      if (name === 'citizenshipDocFlag' && value && !['Y', 'N'].includes(value)) {
        newErr[name] = 'Must be Y or N';
      }

      if (name === 'docValidity' && value && (value.length > 8 || !/^\d*$/.test(value))) {
        newErr[name] = 'Max 8 digits (DDMMYYYY)';
      }

      if (name === 'reasonForNoEvidence' && value.length > 50) {
        newErr[name] = 'Max 50 characters';
      }

      if (name === 'fatcaState' && value.length > 30) {
        newErr[name] = 'Max 30 characters';
      }

      if (name === 'fatcaCity' && value.length > 30) {
        newErr[name] = 'Max 30 characters';
      }

      if (name === 'zipcode' && value && (value.length > 10 || !/^\d*$/.test(value))) {
        newErr[name] = 'Max 10 digits';
      }

      setErrors(newErr);
    },
    [errors]
  );

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // ---------- FULL FORM VALIDATION ----------
  const validateAll = () => {
    const mandatory = ['declarationOfFatca'];
    const newErr = {};

    mandatory.forEach((f) => {
      if (!form[f]) newErr[f] = 'Required';
    });

    Object.keys(form).forEach(field => {
      validateField(field, form[field]);
    });

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  // ---------- OUTPUT JSON ----------
  const getOutputJSON = () => ({
    declarationOfFatca: form.declarationOfFatca,
    fatcaDeclarationCount: form.fatcaDeclarationCount,
    usPerson: form.usPerson,
    taxPayerOfCountries: form.taxPayerOfCountries,
    amlaFlag: form.amlaFlag,
    countryOfTaxRes: form.countryOfTaxRes,
    taxIdentificationNum: form.taxIdentificationNum,
    tinNumIssueCountry: form.tinNumIssueCountry,
    addrOfTaxRes: form.addrOfTaxRes,
    citizenshipDocFlag: form.citizenshipDocFlag,
    docValidity: form.docValidity,
    reasonForNoEvidence: form.reasonForNoEvidence,
    fatcaState: form.fatcaState,
    fatcaCity: form.fatcaCity,
    zipcode: form.zipcode
  });

  // ---------- BUTTON HANDLERS ----------
  const handleNext = () => {
    if (validateAll()) {
      const payload = getOutputJSON();
      localStorage.setItem('fatcaDetails', JSON.stringify(payload));
      navigate('/registration/bank');
    }
  };

  const handleBack = () => {
    navigate('/registration/contact');
  };

  // ---------- RENDER ----------
  return (
    <div className="app-main">
      <section className="form-card">
        <h2>Registration – FATCA & Tax Details</h2>

        {/* FATCA Information */}
        <div className="form-section">
          <h3>FATCA Information</h3>
          <div className="form-grid">

            {/* Declaration of FATCA */}
            <label className={`form-field${errors.declarationOfFatca ? ' has-error' : ''}`}>
              <span className="form-label">
                Declaration of FATCA <span className="required">*</span>
              </span>
              <select
                className="form-input"
                value={form.declarationOfFatca}
                onChange={(e) => handleChange('declarationOfFatca', e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
              {errors.declarationOfFatca && <span className="error-text">{errors.declarationOfFatca}</span>}
            </label>

            {/* FATCA Declaration Count */}
            <label className={`form-field${errors.fatcaDeclarationCount ? ' has-error' : ''}`}>
              <span className="form-label">FATCA Declaration Count</span>
              <input
                type="text"
                className="form-input"
                value={form.fatcaDeclarationCount}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  handleChange('fatcaDeclarationCount', v);
                }}
                placeholder="e.g. 1"
              />
              {errors.fatcaDeclarationCount && <span className="error-text">{errors.fatcaDeclarationCount}</span>}
            </label>

            {/* US Person */}
            <label className={`form-field${errors.usPerson ? ' has-error' : ''}`}>
              <span className="form-label">US Person</span>
              <select
                className="form-input"
                value={form.usPerson}
                onChange={(e) => handleChange('usPerson', e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
              {errors.usPerson && <span className="error-text">{errors.usPerson}</span>}
            </label>

            {/* Tax Payer of Countries */}
            <label className={`form-field${errors.taxPayerOfCountries ? ' has-error' : ''}`}>
              <span className="form-label">Tax Payer of Countries</span>
              <input
                type="text"
                className="form-input"
                value={form.taxPayerOfCountries}
                onChange={(e) => handleChange('taxPayerOfCountries', e.target.value)}
                placeholder="e.g. IN, US"
              />
              {errors.taxPayerOfCountries && <span className="error-text">{errors.taxPayerOfCountries}</span>}
            </label>

            {/* AMLA Flag */}
            <label className={`form-field${errors.amlaFlag ? ' has-error' : ''}`}>
              <span className="form-label">AMLA Flag</span>
              <select
                className="form-input"
                value={form.amlaFlag}
                onChange={(e) => handleChange('amlaFlag', e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
              {errors.amlaFlag && <span className="error-text">{errors.amlaFlag}</span>}
            </label>

            {/* Country of Tax Residence */}
            <label className={`form-field${errors.countryOfTaxRes ? ' has-error' : ''}`}>
              <span className="form-label">Country of Tax Residence</span>
              <input
                type="text"
                className="form-input"
                value={form.countryOfTaxRes}
                onChange={(e) => handleChange('countryOfTaxRes', e.target.value.toUpperCase())}
                placeholder="e.g. IN"
                maxLength={2}
              />
              {errors.countryOfTaxRes && <span className="error-text">{errors.countryOfTaxRes}</span>}
            </label>

            {/* Tax Identification Number */}
            <label className={`form-field${errors.taxIdentificationNum ? ' has-error' : ''}`}>
              <span className="form-label">Tax Identification Number</span>
              <input
                type="text"
                className="form-input"
                value={form.taxIdentificationNum}
                onChange={(e) => handleChange('taxIdentificationNum', e.target.value)}
              />
              {errors.taxIdentificationNum && <span className="error-text">{errors.taxIdentificationNum}</span>}
            </label>

            {/* TIN Issue Country */}
            <label className={`form-field${errors.tinNumIssueCountry ? ' has-error' : ''}`}>
              <span className="form-label">TIN Issue Country</span>
              <input
                type="text"
                className="form-input"
                value={form.tinNumIssueCountry}
                onChange={(e) => handleChange('tinNumIssueCountry', e.target.value.toUpperCase())}
                placeholder="e.g. US"
                maxLength={2}
              />
              {errors.tinNumIssueCountry && <span className="error-text">{errors.tinNumIssueCountry}</span>}
            </label>

            {/* Address of Tax Residence */}
            <label className={`form-field${errors.addrOfTaxRes ? ' has-error' : ''}`}>
              <span className="form-label">Address of Tax Residence</span>
              <input
                type="text"
                className="form-input"
                value={form.addrOfTaxRes}
                onChange={(e) => handleChange('addrOfTaxRes', e.target.value)}
              />
              {errors.addrOfTaxRes && <span className="error-text">{errors.addrOfTaxRes}</span>}
            </label>

            {/* Citizenship Document Flag */}
            <label className={`form-field${errors.citizenshipDocFlag ? ' has-error' : ''}`}>
              <span className="form-label">Citizenship Document Flag</span>
              <select
                className="form-input"
                value={form.citizenshipDocFlag}
                onChange={(e) => handleChange('citizenshipDocFlag', e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
              {errors.citizenshipDocFlag && <span className="error-text">{errors.citizenshipDocFlag}</span>}
            </label>

            {/* Document Validity */}
            <label className={`form-field${errors.docValidity ? ' has-error' : ''}`}>
              <span className="form-label">Document Validity (DDMMYYYY)</span>
              <input
                type="text"
                className="form-input"
                value={form.docValidity}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                  handleChange('docValidity', v);
                }}
                placeholder="DDMMYYYY"
              />
              {errors.docValidity && <span className="error-text">{errors.docValidity}</span>}
            </label>

            {/* Reason for No Evidence */}
            <label className={`form-field${errors.reasonForNoEvidence ? ' has-error' : ''}`}>
              <span className="form-label">Reason for No Evidence</span>
              <input
                type="text"
                className="form-input"
                value={form.reasonForNoEvidence}
                onChange={(e) => handleChange('reasonForNoEvidence', e.target.value)}
              />
              {errors.reasonForNoEvidence && <span className="error-text">{errors.reasonForNoEvidence}</span>}
            </label>

            {/* FATCA State */}
            <label className={`form-field${errors.fatcaState ? ' has-error' : ''}`}>
              <span className="form-label">FATCA State</span>
              <input
                type="text"
                className="form-input"
                value={form.fatcaState}
                onChange={(e) => handleChange('fatcaState', e.target.value)}
              />
              {errors.fatcaState && <span className="error-text">{errors.fatcaState}</span>}
            </label>

            {/* FATCA City */}
            <label className={`form-field${errors.fatcaCity ? ' has-error' : ''}`}>
              <span className="form-label">FATCA City</span>
              <input
                type="text"
                className="form-input"
                value={form.fatcaCity}
                onChange={(e) => handleChange('fatcaCity', e.target.value)}
              />
              {errors.fatcaCity && <span className="error-text">{errors.fatcaCity}</span>}
            </label>

            {/* Zipcode */}
            <label className={`form-field${errors.zipcode ? ' has-error' : ''}`}>
              <span className="form-label">Zipcode</span>
              <input
                type="text"
                className="form-input"
                value={form.zipcode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                  handleChange('zipcode', v);
                }}
                placeholder="e.g. 400001"
              />
              {errors.zipcode && <span className="error-text">{errors.zipcode}</span>}
            </label>

          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="action-button secondary" onClick={handleBack}>
            Back
          </button>
          <button
            type="button"
            className={`action-button${Object.keys(errors).length > 0 || !form.declarationOfFatca ? ' disabled' : ' primary'}`}
            onClick={handleNext}
            disabled={Object.keys(errors).length > 0 || !form.declarationOfFatca}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default TaxDetails;