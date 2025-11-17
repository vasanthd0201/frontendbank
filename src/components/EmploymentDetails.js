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

  // ---------- VALIDATION ----------
  const validateField = useCallback(
    (name, value) => {
      const newErr = { ...errors };
      delete newErr[name];

      if (name === 'occupation') {
        if (!value) newErr[name] = 'Occupation is required';
        else if (value.length > 2) newErr[name] = 'Max 2 characters';
      }

      if (name === 'relativePoliticalExposed' && value && !['Y', 'N'].includes(value)) {
        newErr[name] = 'Must be Y or N';
      }

      if (name === 'otherOccDetails' && value.length > 45) {
        newErr[name] = 'Max 45 characters';
      }

      if (name === 'incomeRange' && value.length > 10) {
        newErr[name] = 'Max 10 characters';
      }

      if (name === 'politicallyExposed' && value.length > 2) {
        newErr[name] = 'Max 2 characters';
      }

      if (name === 'empId' && value.length > 16) {
        newErr[name] = 'Max 16 characters';
      }

      if (name === 'dateOfRetirement' && value && !/^\d{8}$/.test(value)) {
        newErr[name] = 'Must be DDMMYYYY (8 digits)';
      }

      if (name === 'dateOfJoining' && value && !/^\d{8}$/.test(value)) {
        newErr[name] = 'Must be DDMMYYYY (8 digits)';
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
    [errors]
  );

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // ---------- FULL FORM VALIDATION ----------
  const validateAll = () => {
    const mandatory = ['occupation'];
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
    occupation: form.occupation,
    relativePoliticalExposed: form.relativePoliticalExposed,
    otherOccDetails: form.otherOccDetails,
    incomeRange: form.incomeRange,
    politicallyExposed: form.politicallyExposed,
    empId: form.empId,
    dateOfRetirement: form.dateOfRetirement,
    dateOfJoining: form.dateOfJoining,
    empDepartment: form.empDepartment,
    empMinistry: form.empMinistry,
    ddoOffice: form.ddoOffice,
    ppan: form.ppan
  });

  // ---------- BUTTON HANDLERS ----------
  const handleNext = () => {
    if (validateAll()) {
      const payload = getOutputJSON();
      localStorage.setItem('employmentDetails', JSON.stringify(payload));
      navigate('/registration/scheme');
    }
  };

  const handleBack = () => {
    navigate('/registration/bank');
  };

  // ---------- RENDER ----------
  return (
    <div className="app-main">
      <section className="form-card">
        <h2>Registration – Employment Details</h2>

        {/* Employment Information */}
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
                placeholder="e.g. 01"
                maxLength={2}
              />
              {errors.occupation && <span className="error-text">{errors.occupation}</span>}
            </label>

            {/* Relative Political Exposed */}
            <label className={`form-field${errors.relativePoliticalExposed ? ' has-error' : ''}`}>
              <span className="form-label">Relative Politically Exposed</span>
              <select
                className="form-input"
                value={form.relativePoliticalExposed}
                onChange={(e) => handleChange('relativePoliticalExposed', e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
              {errors.relativePoliticalExposed && <span className="error-text">{errors.relativePoliticalExposed}</span>}
            </label>

            {/* Other Occupation Details */}
            <label className={`form-field${errors.otherOccDetails ? ' has-error' : ''}`}>
              <span className="form-label">Other Occupation Details</span>
              <input
                type="text"
                className="form-input"
                value={form.otherOccDetails}
                onChange={(e) => handleChange('otherOccDetails', e.target.value)}
                placeholder="e.g. Freelancer"
              />
              {errors.otherOccDetails && <span className="error-text">{errors.otherOccDetails}</span>}
            </label>

            {/* Income Range */}
            <label className={`form-field${errors.incomeRange ? ' has-error' : ''}`}>
              <span className="form-label">Income Range</span>
              <input
                type="text"
                className="form-input"
                value={form.incomeRange}
                onChange={(e) => handleChange('incomeRange', e.target.value)}
                placeholder="e.g. 5L-10L"
              />
              {errors.incomeRange && <span className="error-text">{errors.incomeRange}</span>}
            </label>

            {/* Politically Exposed */}
            <label className={`form-field${errors.politicallyExposed ? ' has-error' : ''}`}>
              <span className="form-label">Politically Exposed</span>
              <input
                type="text"
                className="form-input"
                value={form.politicallyExposed}
                onChange={(e) => handleChange('politicallyExposed', e.target.value)}
                placeholder="e.g. YN"
                maxLength={2}
              />
              {errors.politicallyExposed && <span className="error-text">{errors.politicallyExposed}</span>}
            </label>

            {/* Employee ID */}
            <label className={`form-field${errors.empId ? ' has-error' : ''}`}>
              <span className="form-label">Employee ID</span>
              <input
                type="text"
                className="form-input"
                value={form.empId}
                onChange={(e) => handleChange('empId', e.target.value)}
                placeholder="e.g. EMP12345"
              />
              {errors.empId && <span className="error-text">{errors.empId}</span>}
            </label>

            {/* Date of Retirement */}
            <label className={`form-field${errors.dateOfRetirement ? ' has-error' : ''}`}>
              <span className="form-label">Date of Retirement</span>
              <input
                type="text"
                className="form-input"
                value={form.dateOfRetirement}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                  handleChange('dateOfRetirement', v);
                }}
                placeholder="DDMMYYYY"
                maxLength={8}
              />
              {errors.dateOfRetirement && <span className="error-text">{errors.dateOfRetirement}</span>}
            </label>

            {/* Date of Joining */}
            <label className={`form-field${errors.dateOfJoining ? ' has-error' : ''}`}>
              <span className="form-label">Date of Joining</span>
              <input
                type="text"
                className="form-input"
                value={form.dateOfJoining}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                  handleChange('dateOfJoining', v);
                }}
                placeholder="DDMMYYYY"
                maxLength={8}
              />
              {errors.dateOfJoining && <span className="error-text">{errors.dateOfJoining}</span>}
            </label>

            {/* Employee Department */}
            <label className={`form-field${errors.empDepartment ? ' has-error' : ''}`}>
              <span className="form-label">Employee Department</span>
              <input
                type="text"
                className="form-input"
                value={form.empDepartment}
                onChange={(e) => handleChange('empDepartment', e.target.value)}
                placeholder="e.g. IT"
              />
              {errors.empDepartment && <span className="error-text">{errors.empDepartment}</span>}
            </label>

            {/* Employee Ministry */}
            <label className={`form-field${errors.empMinistry ? ' has-error' : ''}`}>
              <span className="form-label">Employee Ministry</span>
              <input
                type="text"
                className="form-input"
                value={form.empMinistry}
                onChange={(e) => handleChange('empMinistry', e.target.value)}
                placeholder="e.g. Ministry of Finance"
              />
              {errors.empMinistry && <span className="error-text">{errors.empMinistry}</span>}
            </label>

            {/* DDO Office */}
            <label className={`form-field${errors.ddoOffice ? ' has-error' : ''}`}>
              <span className="form-label">DDO Office</span>
              <input
                type="text"
                className="form-input"
                value={form.ddoOffice}
                onChange={(e) => handleChange('ddoOffice', e.target.value)}
                placeholder="e.g. DDO Mumbai"
              />
              {errors.ddoOffice && <span className="error-text">{errors.ddoOffice}</span>}
            </label>

            {/* PPAN */}
            <label className={`form-field${errors.ppan ? ' has-error' : ''}`}>
              <span className="form-label">PPAN</span>
              <input
                type="text"
                className="form-input"
                value={form.ppan}
                onChange={(e) => handleChange('ppan', e.target.value)}
                placeholder="e.g. PPAN123456"
              />
              {errors.ppan && <span className="error-text">{errors.ppan}</span>}
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
            className={`action-button${Object.keys(errors).length > 0 || !form.occupation ? ' disabled' : ' primary'}`}
            onClick={handleNext}
            disabled={Object.keys(errors).length > 0 || !form.occupation}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default EmploymentDetails;