import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/NomineeDetailsForm.css';

const calculateAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const initialNomineeState = {
  firstName: '',
  middleName: '',
  lastName: '',
  relationship: '',
  dateOfBirth: '',
  nomineeAge: '',
  majorMinorFlag: '',
  percentageShare: '',
  relationshipOther: '',
  guardianFirstName: '',
  guardianMiddleName: '',
  guardianLastName: '',
};

const NomineeDetails = () => {
  const navigate = useNavigate();

  const [nominees, setNominees] = useState([initialNomineeState]);
  const [totalShare, setTotalShare] = useState(0);
  const [errors, setErrors] = useState({});

  const relationshipOptions = [
    'Spouse', 'Mother', 'Father', 'Son', 'Daughter',
    'Brother', 'Sister', 'Daughter-in-Law', 'Grandson',
    'Granddaughter', 'Other'
  ];

  // Update total share
  useEffect(() => {
    const sum = nominees.reduce((acc, n) => acc + (parseFloat(n.percentageShare) || 0), 0);
    setTotalShare(Math.round(sum * 100) / 100);
  }, [nominees]);

  // Update age & major/minor flag
  const dobDeps = nominees.map(n => n.dateOfBirth).join(',');
  useEffect(() => {
    setNominees(prev => prev.map(nominee => {
      if (!nominee.dateOfBirth) {
        return { ...nominee, nomineeAge: '', majorMinorFlag: '' };
      }
      const age = calculateAge(nominee.dateOfBirth);
      const flag = age < 18 ? 'M' : age >= 18 ? 'T' : '';
      return { ...nominee, nomineeAge: age.toString(), majorMinorFlag: flag };
    }));
  }, [dobDeps]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    let sanitized = value;

    // Name fields: letters, spaces, hyphens, apostrophes
    if (['firstName', 'middleName', 'lastName', 'relationshipOther', 'guardianFirstName', 'guardianMiddleName', 'guardianLastName'].includes(name)) {
      sanitized = value.replace(/[^A-Za-z\s'-]/g, '');
    }

    // Percentage: 0–100, max 3 digits
    if (name === 'percentageShare') {
      sanitized = value.replace(/\D/g, '').slice(0, 3);
      if (sanitized && (parseInt(sanitized) < 1 || parseInt(sanitized) > 100)) {
        sanitized = sanitized.slice(0, 2);
      }
    }

    setNominees(prev => prev.map((n, i) => {
      if (i !== index) return n;
      const updated = { ...n, [name]: sanitized };
      if (name === 'relationship' && value !== 'Other') {
        updated.relationshipOther = '';
      }
      return updated;
    }));

    // Clear error
    setErrors(prev => {
      const newErr = { ...prev };
      delete newErr[`${index}_${name}`];
      return newErr;
    });
  };

  const handleAddNominee = () => {
    if (nominees.length < 3) {
      setNominees([...nominees, { ...initialNomineeState }]);
    }
  };

  const handleRemoveNominee = (index) => {
    if (nominees.length > 1) {
      setNominees(nominees.filter((_, i) => i !== index));
    }
  };

  const validateAll = () => {
    const newErr = {};

    nominees.forEach((nominee, idx) => {
      if (!nominee.firstName) newErr[`${idx}_firstName`] = 'Required';
      if (!nominee.relationship) newErr[`${idx}_relationship`] = 'Required';
      if (!nominee.dateOfBirth) newErr[`${idx}_dateOfBirth`] = 'Required';
      if (!nominee.percentageShare) newErr[`${idx}_percentageShare`] = 'Required';

      if (nominee.relationship === 'Other' && !nominee.relationshipOther) {
        newErr[`${idx}_relationshipOther`] = 'Required';
      }

      if (nominee.majorMinorFlag === 'M') {
        if (!nominee.guardianFirstName) newErr[`${idx}_guardianFirstName`] = 'Required';
        if (!nominee.guardianLastName) newErr[`${idx}_guardianLastName`] = 'Required';
      }
    });

    if (totalShare !== 100) {
      newErr.total = 'Total must be 100%';
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleNext = () => {
    if (validateAll()) {
      localStorage.setItem('nomineeDetails', JSON.stringify(nominees));
      navigate('/registration/photo-signature');
    }
  };

  const handleBack = () => {
    navigate('/registration/scheme');
  };

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
      <section className="form-card">
        <h2>Registration – Nominee Details</h2>

        <div className="nominees-container" onKeyDown={handleKeyDown}>
          {nominees.map((nominee, index) => {
            const isMinor = nominee.majorMinorFlag === 'M';
            const isOther = nominee.relationship === 'Other';

            return (
              <div key={index} className="nominee-card">
                <div className="nominee-header">
                  <h3>Nominee {index + 1}</h3>
                  {nominees.length > 1 && (
                    <button
                      type="button"
                      className="remove-nominee-btn"
                      onClick={() => handleRemoveNominee(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Name Row */}
                <div className="form-row">
                  <label className={`form-field${errors[`${index}_firstName`] ? ' has-error' : ''}`}>
                    <span className="form-label">First Name <span className="required">*</span></span>
                    <input
                      type="text"
                      className="form-input"
                      value={nominee.firstName}
                      onChange={(e) => handleChange(index, e)}
                      name="firstName"
                      maxLength={30}
                      placeholder="John"
                    />
                    {errors[`${index}_firstName`] && <span className="error-text">{errors[`${index}_firstName`]}</span>}
                  </label>

                  <label className="form-field">
                    <span className="form-label">Middle Name</span>
                    <input
                      type="text"
                      className="form-input"
                      value={nominee.middleName}
                      onChange={(e) => handleChange(index, e)}
                      name="middleName"
                      maxLength={30}
                    />
                  </label>

                  <label className="form-field">
                    <span className="form-label">Last Name</span>
                    <input
                      type="text"
                      className="form-input"
                      value={nominee.lastName}
                      onChange={(e) => handleChange(index, e)}
                      name="lastName"
                      maxLength={30}
                    />
                  </label>
                </div>

                {/* Relationship & DOB */}
                <div className="form-row">
                  <label className={`form-field${errors[`${index}_relationship`] ? ' has-error' : ''}`}>
                    <span className="form-label">Relationship <span className="required">*</span></span>
                    <select
                      className="form-input"
                      value={nominee.relationship}
                      onChange={(e) => handleChange(index, e)}
                      name="relationship"
                    >
                      <option value="" disabled>Select</option>
                      {relationshipOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors[`${index}_relationship`] && <span className="error-text">{errors[`${index}_relationship`]}</span>}
                  </label>

                  <label className={`form-field${errors[`${index}_dateOfBirth`] ? ' has-error' : ''}`}>
                    <span className="form-label">Date of Birth <span className="required">*</span></span>
                    <input
                      type="date"
                      className="form-input"
                      value={nominee.dateOfBirth}
                      onChange={(e) => handleChange(index, e)}
                      name="dateOfBirth"
                    />
                    {errors[`${index}_dateOfBirth`] && <span className="error-text">{errors[`${index}_dateOfBirth`]}</span>}
                  </label>

                  <label className="form-field">
                    <span className="form-label">Age</span>
                    <input
                      type="text"
                      className="form-input readonly"
                      value={nominee.nomineeAge}
                      readOnly
                    />
                  </label>
                </div>

                {/* Other Relationship */}
                {isOther && (
                  <div className="form-row">
                    <label className={`form-field${errors[`${index}_relationshipOther`] ? ' has-error' : ''}`}>
                      <span className="form-label">Specify Relationship <span className="required">*</span></span>
                      <input
                        type="text"
                        className="form-input"
                        value={nominee.relationshipOther}
                        onChange={(e) => handleChange(index, e)}
                        name="relationshipOther"
                        maxLength={30}
                      />
                      {errors[`${index}_relationshipOther`] && <span className="error-text">{errors[`${index}_relationshipOther`]}</span>}
                    </label>
                  </div>
                )}

                {/* Major/Minor + Share */}
                <div className="form-row">
                  <label className="form-field">
                    <span className="form-label">Status</span>
                    <input
                      type="text"
                      className="form-input readonly"
                      value={nominee.majorMinorFlag === 'M' ? 'Minor' : nominee.majorMinorFlag === 'T' ? 'Major' : ''}
                      readOnly
                    />
                    <p className="field-note">
                      {isMinor ? 'Guardian details required' : 'Auto-calculated'}
                    </p>
                  </label>

                  <label className={`form-field${errors[`${index}_percentageShare`] ? ' has-error' : ''}`}>
                    <span className="form-label"> Share % <span className="required">*</span></span>
                    <div className="input-with-clear">
                      <input
                        type="text"
                        className="form-input"
                        value={nominee.percentageShare}
                        onChange={(e) => handleChange(index, e)}
                        name="percentageShare"
                        placeholder="50"
                      />
                      {nominee.percentageShare && (
                        <button
                          type="button"
                          className="clear-btn"
                          onClick={() => handleChange(index, { target: { name: 'percentageShare', value: '' } })}
                        >
                          X
                        </button>
                      )}
                    </div>
                    {errors[`${index}_percentageShare`] && <span className="error-text">{errors[`${index}_percentageShare`]}</span>}
                  </label>
                </div>

                {/* Guardian Section */}
                {isMinor && (
                  <div className="guardian-section">
                    <h4>Guardian Details</h4>
                    <div className="form-row">
                      <label className={`form-field${errors[`${index}_guardianFirstName`] ? ' has-error' : ''}`}>
                        <span className="form-label">First Name <span className="required">*</span></span>
                        <input
                          type="text"
                          className="form-input"
                          value={nominee.guardianFirstName}
                          onChange={(e) => handleChange(index, e)}
                          name="guardianFirstName"
                          maxLength={30}
                        />
                        {errors[`${index}_guardianFirstName`] && <span className="error-text">{errors[`${index}_guardianFirstName`]}</span>}
                      </label>

                      <label className="form-field">
                        <span className="form-label">Middle Name</span>
                        <input
                          type="text"
                          className="form-input"
                          value={nominee.guardianMiddleName}
                          onChange={(e) => handleChange(index, e)}
                          name="guardianMiddleName"
                          maxLength={30}
                        />
                      </label>

                      <label className={`form-field${errors[`${index}_guardianLastName`] ? ' has-error' : ''}`}>
                        <span className="form-label">Last Name <span className="required">*</span></span>
                        <input
                          type="text"
                          className="form-input"
                          value={nominee.guardianLastName}
                          onChange={(e) => handleChange(index, e)}
                          name="guardianLastName"
                          maxLength={30}
                        />
                        {errors[`${index}_guardianLastName`] && <span className="error-text">{errors[`${index}_guardianLastName`]}</span>}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="form-footer">
          <button
            type="button"
            className="add-nominee-btn"
            onClick={handleAddNominee}
            disabled={nominees.length >= 3}
          >
            + Add Nominee
          </button>

          <div className="total-share">
            Total Share: <strong>{totalShare}%</strong>
            {errors.total && <span className="error-text">{errors.total}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="action-button secondary" onClick={handleBack}>
              Back
            </button>
            <button
              type="button"
              className={`action-button${Object.keys(errors).length > 0 || totalShare !== 100 ? ' disabled' : ' primary'}`}
              onClick={handleNext}
              disabled={Object.keys(errors).length > 0 || totalShare !== 100}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NomineeDetails;