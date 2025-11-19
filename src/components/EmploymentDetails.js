import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/EmploymentDetails.css';

const EmploymentDetails = () => {
  const navigate = useNavigate();

  // ---------- FORM STATE ----------
  const [form, setForm] = useState({
    occupation: '',
    relativePoliticalExposed: '',
    otherOccDetails: '',
    incomeRange: '',
    politicallyExposed: '',
    empId: '',
    dateOfRetirement: '',
    dateOfJoining: '',
    empDepartment: '',
    empMinistry: '',
    ddoOffice: '',
    ppan: ''
  });

  const [errors, setErrors] = useState({});

  // Convert yyyy-mm-dd → ddmmyyyy
  const formatToDDMMYYYY = (value) => {
    if (!value) return '';
    const [yyyy, mm, dd] = value.split('-');
    return dd + mm + yyyy;
  };

  // ---------- VALIDATION ----------
  const validateField = useCallback(
    (name, value) => {
      const newErr = { ...errors };
      delete newErr[name];

      // Occupation mandatory + 2 digits
      if (name === 'occupation') {
        if (!value) newErr[name] = 'Occupation is required';
        else if (!/^\d{2}$/.test(value)) newErr[name] = 'Must be 2 digits';
      }

      // Other Occupation Details mandatory only when occupation = 06
      if (name === 'otherOccDetails') {
        if (form.occupation === '06' && !value) {
          newErr[name] = 'Required when Occupation is 06';
        } else if (value.length > 45) {
          newErr[name] = 'Max 45 characters';
        }
      }

      // Income Range — do not allow "00"
      if (name === 'incomeRange') {
        if (value === '00') newErr[name] = '00 is not a valid income range';
        else if (value.length > 10) newErr[name] = 'Max 10 characters';
      }

      if (name === 'relativePoliticalExposed' && value && !['Y', 'N'].includes(value)) {
        newErr[name] = 'Must be Y or N';
      }

      if (name === 'politicallyExposed' && value.length > 2) {
        newErr[name] = 'Max 2 characters';
      }

      if (name === 'empId' && value.length > 16) {
        newErr[name] = 'Max 16 characters';
      }

      // Date fields must be 8 digits (DDMMYYYY)
      if ((name === 'dateOfJoining' || name === 'dateOfRetirement') && value) {
        if (!/^\d{8}$/.test(value)) newErr[name] = 'Must be DDMMYYYY (8 digits)';
      }

      if (name === 'empDepartment' && value.length > 40) {
        newErr[name] = 'Max 40 characters';
      }

      if (name === 'empMinistry' && value.length > 80) {
        newErr[name] = 'Max 80 characters';
      }

      if (name === 'ddoOffice' && value.length > 75) {
        newErr[name] = 'Max 75 characters';
      }

      if (name === 'ppan' && value.length > 16) {
        newErr[name] = 'Max 16 characters';
      }

      setErrors(newErr);
    },
    [errors, form.occupation]
  );

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

const validateAll = () => {
  const newErr = {};

  // Occupation (mandatory + 2 digits)
  if (!form.occupation) newErr.occupation = "Required";
  else if (!/^\d{2}$/.test(form.occupation))
    newErr.occupation = "Must be 2 digits";

  // Other Occupation Details (mandatory only if occupation = 06)
  if (form.occupation === "06" && !form.otherOccDetails)
    newErr.otherOccDetails = "Required when Occupation is 06";
  else if (form.otherOccDetails && form.otherOccDetails.length > 45)
    newErr.otherOccDetails = "Max 45 characters";

  // Income Range
  if (form.incomeRange === "00")
    newErr.incomeRange = "00 is not a valid income range";
  else if (form.incomeRange && form.incomeRange.length > 10)
    newErr.incomeRange = "Max 10 characters";

  // Date Validation (must be 8 digits)
  if (form.dateOfJoining && !/^\d{8}$/.test(form.dateOfJoining))
    newErr.dateOfJoining = "Must be DDMMYYYY (8 digits)";

  if (form.dateOfRetirement && !/^\d{8}$/.test(form.dateOfRetirement))
    newErr.dateOfRetirement = "Must be DDMMYYYY (8 digits)";

  // Politically Exposed Fields
  if (form.relativePoliticalExposed && !["Y", "N"].includes(form.relativePoliticalExposed))
    newErr.relativePoliticalExposed = "Must be Y or N";

  if (form.politicallyExposed && form.politicallyExposed.length > 2)
    newErr.politicallyExposed = "Max 2 characters";

  // Employee ID
  if (form.empId && form.empId.length > 16)
    newErr.empId = "Max 16 characters";

  // Department
  if (form.empDepartment && form.empDepartment.length > 40)
    newErr.empDepartment = "Max 40 characters";

  // Ministry
  if (form.empMinistry && form.empMinistry.length > 80)
    newErr.empMinistry = "Max 80 characters";

  // DDO Office
  if (form.ddoOffice && form.ddoOffice.length > 75)
    newErr.ddoOffice = "Max 75 characters";

  // PPAN
  if (form.ppan && form.ppan.length > 16)
    newErr.ppan = "Max 16 characters";

  setErrors(newErr);

  return Object.keys(newErr).length === 0;
};


  const handleNext = () => {
    if (validateAll()) {
      localStorage.setItem('employmentDetails', JSON.stringify(form));
      navigate('/registration/scheme');
    }
  };

  const handleBack = () => navigate('/registration/bank');
  const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const form = e.target.closest(".form-grid");
    const inputs = Array.from(
      form.querySelectorAll("input, select, textarea")
    );

    const index = inputs.indexOf(e.target);
    const next = inputs[index + 1];

    if (next) next.focus();
    else handleNext();
  }
};

  return (
    <div className="app-main">
      <section className="form-card" onKeyDown={handleKeyDown}>
        <h2>Registration – Employment Details</h2>

        <div className="form-section">
          <h3>Employment Information</h3>
          <div className="form-grid">

            {/* Occupation */}
            <label className={`form-field${errors.occupation ? ' has-error' : ''}`}>
              <span className="form-label">
                Occupation <span className="required">*</span>
              </span>
              <input
                type="text"
                className="form-input"
                value={form.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                placeholder="e.g. 06"
                maxLength={2}
              />
              {errors.occupation && <span className="error-text">{errors.occupation}</span>}
            </label>

            {/* Other Occupation Details */}
            <label className={`form-field${errors.otherOccDetails ? ' has-error' : ''}`}>
              <span className="form-label">
                Other Occupation Details
                {form.occupation === '06' && <span className="required"> *</span>}
              </span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Private Tutor"
                value={form.otherOccDetails}
                onChange={(e) => handleChange('otherOccDetails', e.target.value)}
              />
              {errors.otherOccDetails && <span className="error-text">{errors.otherOccDetails}</span>}
            </label>

            {/* Relative Politically Exposed */}
            <label className="form-field">
              <span className="form-label">Relative Politically Exposed</span>
              <select
                className="form-input"
                value={form.relativePoliticalExposed}
                onChange={(e) => handleChange('relativePoliticalExposed', e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </label>

            {/* Date of Joining */}
            <label className={`form-field${errors.dateOfJoining ? ' has-error' : ''}`}>
              <span className="form-label">Date of Joining</span>
              <input
                type="date"
                className="form-input"
                onChange={(e) =>
                  handleChange('dateOfJoining', formatToDDMMYYYY(e.target.value))
                }
              />
              {errors.dateOfJoining && <span className="error-text">{errors.dateOfJoining}</span>}
            </label>

            {/* Date of Retirement */}
            <label className={`form-field${errors.dateOfRetirement ? ' has-error' : ''}`}>
              <span className="form-label">Date of Retirement</span>
              <input
                type="date"
                className="form-input"
                onChange={(e) =>
                  handleChange('dateOfRetirement', formatToDDMMYYYY(e.target.value))
                }
              />
              {errors.dateOfRetirement && <span className="error-text">{errors.dateOfRetirement}</span>}
            </label>

            {/* Income Range */}
            <label className={`form-field${errors.incomeRange ? ' has-error' : ''}`}>
              <span className="form-label">Income Range</span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 05 (for 5 lakhs)"
                value={form.incomeRange}
                onChange={(e) => handleChange('incomeRange', e.target.value)}
              />
              {errors.incomeRange && <span className="error-text">{errors.incomeRange}</span>}
            </label>

            {/* Politically Exposed */}
            <label className={`form-field${errors.politicallyExposed ? ' has-error' : ''}`}>
              <span className="form-label">Politically Exposed</span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. YN"
                maxLength={2}
                value={form.politicallyExposed}
                onChange={(e) => handleChange('politicallyExposed', e.target.value)}
              />
            </label>

            {/* Employee ID */}
            <label className={`form-field${errors.empId ? ' has-error' : ''}`}>
              <span className="form-label">Employee ID</span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. EMP12345"
                value={form.empId}
                onChange={(e) => handleChange('empId', e.target.value)}
              />
            </label>

            {/* Department */}
            <label className={`form-field${errors.empDepartment ? ' has-error' : ''}`}>
              <span className="form-label">Employee Department</span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. IT Department"
                value={form.empDepartment}
                onChange={(e) => handleChange('empDepartment', e.target.value)}
              />
            </label>

            {/* Ministry */}
            <label className={`form-field${errors.empMinistry ? ' has-error' : ''}`}>
              <span className="form-label">Employee Ministry</span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ministry of Finance"
                value={form.empMinistry}
                onChange={(e) => handleChange('empMinistry', e.target.value)}
              />
            </label>

            {/* DDO Office */}
            <label className={`form-field${errors.ddoOffice ? ' has-error' : ''}`}>
              <span className="form-label">DDO Office</span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. DDO Mumbai"
                value={form.ddoOffice}
                onChange={(e) => handleChange('ddoOffice', e.target.value)}
              />
            </label>

            {/* PPAN */}
            <label className={`form-field${errors.ppan ? ' has-error' : ''}`}>
              <span className="form-label">PPAN</span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. PPAN123456"
                value={form.ppan}
                onChange={(e) => handleChange('ppan', e.target.value)}
              />
            </label>

          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="action-button secondary" onClick={handleBack}>
            Back
          </button>

          <button
            type="button"
            className="action-button primary"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default EmploymentDetails;
