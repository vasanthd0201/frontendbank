import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ContactDetails.css';

const ContactDetails = () => {
  const navigate = useNavigate();

  // ---------- FORM STATE ----------
  const [form, setForm] = useState({
    cAddrLine1: '',
    cAddrLine2: '',
    cAddrLine3: '',
    cAddrLine4: '',
    cState: '',
    cCountry: '',
    cPincode: '',
    cAddrProof: '',
    cAddrProofName: '',
    pAddrLine1: '',
    pAddrLine2: '',
    pAddrLine3: '',
    pAddrLine4: '',
    pState: '',
    pCountry: '',
    pPincode: '',
    pAddrProof: '',
    cAddrProofDocNo: '',
    addrProofDocName: '',
    foreignAddressStateForNRI: '',
    smsSubFlag: '',
    emailSubFlag: '',
    preferredAddressForCommunication: '',
    emailVerificationFlag: '',
    mobileVerificationFlag: ''
  });

  const [errors, setErrors] = useState({});

  // ---------- VALIDATION ----------
  const validateField = useCallback(
    (name, value) => {
      const newErr = { ...errors };
      delete newErr[name];

      // Correspondence Address
      if (name === 'cAddrLine1' && (value.length > 60)) newErr[name] = 'Max 60 characters';
      if (name === 'cAddrLine2' && (value.length > 60)) newErr[name] = 'Max 60 characters';
      if (name === 'cAddrLine3' && (value.length > 60)) newErr[name] = 'Max 60 characters';
      if (name === 'cAddrLine4' && (value.length > 60)) newErr[name] = 'Max 60 characters';
      if (name === 'cState' && (value.length > 2)) newErr[name] = 'Max 2 characters';
      if (name === 'cCountry' && (value.length > 2)) newErr[name] = 'Max 2 characters';
      if (name === 'cPincode' && (value.length > 10)) newErr[name] = 'Max 10 characters';
      if (name === 'cAddrProof' && (value.length > 30)) newErr[name] = 'Max 30 characters';
      if (name === 'cAddrProofName' && (value.length > 30)) newErr[name] = 'Max 30 characters';

      // Permanent Address
      if (name === 'pAddrLine1') {
        if (!value) newErr[name] = 'Permanent Address Line 1 is required';
        else if (value.length > 60) newErr[name] = 'Max 60 characters';
      }
      if (name === 'pAddrLine2' && value.length > 60) newErr[name] = 'Max 60 characters';
      if (name === 'pAddrLine3' && value.length > 60) newErr[name] = 'Max 60 characters';
      if (name === 'pAddrLine4' && value.length > 60) newErr[name] = 'Max 60 characters';
      if (name === 'pState' && value.length > 2) newErr[name] = 'Max 2 characters';
      if (name === 'pCountry' && value.length > 2) newErr[name] = 'Max 2 characters';
      if (name === 'pPincode' && value.length > 10) newErr[name] = 'Max 10 characters';
      if (name === 'pAddrProof' && value.length > 3) newErr[name] = 'Max 3 characters';
      if (name === 'cAddrProofDocNo' && value.length > 30) newErr[name] = 'Max 30 characters';
      if (name === 'addrProofDocName' && value.length > 30) newErr[name] = 'Max 30 characters';
      if (name === 'foreignAddressStateForNRI' && value.length > 30) newErr[name] = 'Max 30 characters';

      // Communication Preferences
      if (name === 'smsSubFlag' && value && !['Y', 'N'].includes(value)) newErr[name] = 'Must be Y or N';
      if (name === 'emailSubFlag' && value && !['Y', 'N'].includes(value)) newErr[name] = 'Must be Y or N';
      if (name === 'preferredAddressForCommunication' && value && !['O', 'I'].includes(value)) newErr[name] = 'Must be O or I';
      if (name === 'emailVerificationFlag' && value && !['Y', 'N'].includes(value)) newErr[name] = 'Must be Y or N';
      if (name === 'mobileVerificationFlag' && value && !['Y', 'N'].includes(value)) newErr[name] = 'Must be Y or N';

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
    const mandatory = ['pAddrLine1'];
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
    cAddrLine1: form.cAddrLine1,
    cAddrLine2: form.cAddrLine2,
    cAddrLine3: form.cAddrLine3,
    cAddrLine4: form.cAddrLine4,
    cState: form.cState,
    cCountry: form.cCountry,
    cPincode: form.cPincode,
    cAddrProof: form.cAddrProof,
    cAddrProofName: form.cAddrProofName,
    pAddrLine1: form.pAddrLine1,
    pAddrLine2: form.pAddrLine2,
    pAddrLine3: form.pAddrLine3,
    pAddrLine4: form.pAddrLine4,
    pState: form.pState,
    pCountry: form.pCountry,
    pPincode: form.pPincode,
    pAddrProof: form.pAddrProof,
    cAddrProofDocNo: form.cAddrProofDocNo,
    addrProofDocName: form.addrProofDocName,
    foreignAddressStateForNri: form.foreignAddressStateForNRI,
    smsSubFlag: form.smsSubFlag,
    emailSubFlag: form.emailSubFlag,
    preferredStyleForCommunication: form.preferredAddressForCommunication,
    emailVerificationFlag: form.emailVerificationFlag,
    mobileVerificationFlag: form.mobileVerificationFlag
  });

  // ---------- BUTTON HANDLERS ----------
  const handleNext = () => {
    if (validateAll()) {
      const payload = getOutputJSON();
      localStorage.setItem('contactDetails', JSON.stringify(payload));
      navigate('/registration/fatca');
    }
  };

  const handleBack = () => {
    navigate('/registration/personal');
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

  // ---------- RENDER ----------
  return (
    <div className="app-main">
      <section className="form-card">
        <h2>Contact Details</h2>

        {/* Correspondence Address */}
        <div className="form-section">
          <h3>Correspondence Address</h3>
          <div className="form-grid" onKeyDown={handleKeyDown}>
            <label className={`form-field${errors.cAddrLine1 ? ' has-error' : ''}`}>
              <span className="form-label">Correspondence Address Line 1</span>
              <input type="text" className="form-input" value={form.cAddrLine1} onChange={(e) => handleChange('cAddrLine1', e.target.value)} />
              {errors.cAddrLine1 && <span className="error-text">{errors.cAddrLine1}</span>}
            </label>

            <label className={`form-field${errors.cAddrLine2 ? ' has-error' : ''}`}>
              <span className="form-label">Correspondence Address Line 2</span>
              <input type="text" className="form-input" value={form.cAddrLine2} onChange={(e) => handleChange('cAddrLine2', e.target.value)} />
              {errors.cAddrLine2 && <span className="error-text">{errors.cAddrLine2}</span>}
            </label>

            <label className={`form-field${errors.cAddrLine3 ? ' has-error' : ''}`}>
              <span className="form-label">Correspondence Address Line 3</span>
              <input type="text" className="form-input" value={form.cAddrLine3} onChange={(e) => handleChange('cAddrLine3', e.target.value)} />
              {errors.cAddrLine3 && <span className="error-text">{errors.cAddrLine3}</span>}
            </label>

            <label className={`form-field${errors.cAddrLine4 ? ' has-error' : ''}`}>
              <span className="form-label">Correspondence Address Line 4</span>
              <input type="text" className="form-input" value={form.cAddrLine4} onChange={(e) => handleChange('cAddrLine4', e.target.value)} />
              {errors.cAddrLine4 && <span className="error-text">{errors.cAddrLine4}</span>}
            </label>

            <label className={`form-field${errors.cState ? ' has-error' : ''}`}>
              <span className="form-label">Correspondence State</span>
              <input type="text" className="form-input" value={form.cState} onChange={(e) => handleChange('cState', e.target.value)} />
              {errors.cState && <span className="error-text">{errors.cState}</span>}
            </label>

            <label className={`form-field${errors.cCountry ? ' has-error' : ''}`}>
              <span className="form-label">Correspondence Country</span>
              <input type="text" className="form-input" value={form.cCountry} onChange={(e) => handleChange('cCountry', e.target.value)} />
              {errors.cCountry && <span className="error-text">{errors.cCountry}</span>}
            </label>

            <label className={`form-field${errors.cPincode ? ' has-error' : ''}`}>
              <span className="form-label">Correspondence Pincode</span>
              <input type="text" className="form-input" value={form.cPincode} onChange={(e) => handleChange('cPincode', e.target.value)} />
              {errors.cPincode && <span className="error-text">{errors.cPincode}</span>}
            </label>

            <label className={`form-field${errors.cAddrProof ? ' has-error' : ''}`}>
              <span className="form-label">Correspondence Address Proof</span>
              <input type="text" className="form-input" value={form.cAddrProof} onChange={(e) => handleChange('cAddrProof', e.target.value)} />
              {errors.cAddrProof && <span className="error-text">{errors.cAddrProof}</span>}
            </label>

            <label className={`form-field${errors.cAddrProofName ? ' has-error' : ''}`}>
              <span className="form-label">Correspondence Address Proof Name</span>
              <input type="text" className="form-input" value={form.cAddrProofName} onChange={(e) => handleChange('cAddrProofName', e.target.value)} />
              {errors.cAddrProofName && <span className="error-text">{errors.cAddrProofName}</span>}
            </label>
          </div>
        </div>

        {/* Permanent Address */}
        <div className="form-section">
          <h3>Permanent Address</h3>
          <div className="form-grid" onKeyDown={handleKeyDown}>
            <label className={`form-field${errors.pAddrLine1 ? ' has-error' : ''}`}>
              <span className="form-label">
                Permanent Address Line 1 <span className="required">*</span>
              </span>
              <input type="text" className="form-input" value={form.pAddrLine1} onChange={(e) => handleChange('pAddrLine1', e.target.value)} />
              {errors.pAddrLine1 && <span className="error-text">{errors.pAddrLine1}</span>}
            </label>

            <label className={`form-field${errors.pAddrLine2 ? ' has-error' : ''}`}>
              <span className="form-label">Permanent Address Line 2</span>
              <input type="text" className="form-input" value={form.pAddrLine2} onChange={(e) => handleChange('pAddrLine2', e.target.value)} />
              {errors.pAddrLine2 && <span className="error-text">{errors.pAddrLine2}</span>}
            </label>

            <label className={`form-field${errors.pAddrLine3 ? ' has-error' : ''}`}>
              <span className="form-label">Permanent Address Line 3</span>
              <input type="text" className="form-input" value={form.pAddrLine3} onChange={(e) => handleChange('pAddrLine3', e.target.value)} />
              {errors.pAddrLine3 && <span className="error-text">{errors.pAddrLine3}</span>}
            </label>

            <label className={`form-field${errors.pAddrLine4 ? ' has-error' : ''}`}>
              <span className="form-label">Permanent Address Line 4</span>
              <input type="text" className="form-input" value={form.pAddrLine4} onChange={(e) => handleChange('pAddrLine4', e.target.value)} />
              {errors.pAddrLine4 && <span className="error-text">{errors.pAddrLine4}</span>}
            </label>

            <label className={`form-field${errors.pState ? ' has-error' : ''}`}>
              <span className="form-label">Permanent State</span>
              <input type="text" className="form-input" value={form.pState} onChange={(e) => handleChange('pState', e.target.value)} />
              {errors.pState && <span className="error-text">{errors.pState}</span>}
            </label>

            <label className={`form-field${errors.pCountry ? ' has-error' : ''}`}>
              <span className="form-label">Permanent Country</span>
              <input type="text" className="form-input" value={form.pCountry} onChange={(e) => handleChange('pCountry', e.target.value)} />
              {errors.pCountry && <span className="error-text">{errors.pCountry}</span>}
            </label>

            <label className={`form-field${errors.pPincode ? ' has-error' : ''}`}>
              <span className="form-label">Permanent Pincode</span>
              <input type="text" className="form-input" value={form.pPincode} onChange={(e) => handleChange('pPincode', e.target.value)} />
              {errors.pPincode && <span className="error-text">{errors.pPincode}</span>}
            </label>

            <label className={`form-field${errors.pAddrProof ? ' has-error' : ''}`}>
              <span className="form-label">Permanent Address Proof</span>
              <input type="text" className="form-input" value={form.pAddrProof} onChange={(e) => handleChange('pAddrProof', e.target.value)} />
              {errors.pAddrProof && <span className="error-text">{errors.pAddrProof}</span>}
            </label>

            <label className={`form-field${errors.cAddrProofDocNo ? ' has-error' : ''}`}>
              <span className="form-label">Correspondence Address Proof Doc No</span>
              <input type="text" className="form-input" value={form.cAddrProofDocNo} onChange={(e) => handleChange('cAddrProofDocNo', e.target.value)} />
              {errors.cAddrProofDocNo && <span className="error-text">{errors.cAddrProofDocNo}</span>}
            </label>

            <label className={`form-field${errors.addrProofDocName ? ' has-error' : ''}`}>
              <span className="form-label">Address Proof Doc Name</span>
              <input type="text" className="form-input" value={form.addrProofDocName} onChange={(e) => handleChange('addrProofDocName', e.target.value)} />
              {errors.addrProofDocName && <span className="error-text">{errors.addrProofDocName}</span>}
            </label>

            <label className={`form-field${errors.foreignAddressStateForNRI ? ' has-error' : ''}`}>
              <span className="form-label">Foreign Address State For NRI</span>
              <input type="text" className="form-input" value={form.foreignAddressStateForNRI} onChange={(e) => handleChange('foreignAddressStateForNRI', e.target.value)} />
              {errors.foreignAddressStateForNRI && <span className="error-text">{errors.foreignAddressStateForNRI}</span>}
            </label>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="form-section">
          <h3>Communication Preferences</h3>
          <div className="form-grid"onKeyDown={handleKeyDown}>
            <label className={`form-field${errors.smsSubFlag ? ' has-error' : ''}`}>
              <span className="form-label">SMS Subscription Flag</span>
              <select className="form-input" value={form.smsSubFlag} onChange={(e) => handleChange('smsSubFlag', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
              {errors.smsSubFlag && <span className="error-text">{errors.smsSubFlag}</span>}
            </label>

            <label className={`form-field${errors.emailSubFlag ? ' has-error' : ''}`}>
              <span className="form-label">Email Subscription Flag</span>
              <select className="form-input" value={form.emailSubFlag} onChange={(e) => handleChange('emailSubFlag', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
              {errors.emailSubFlag && <span className="error-text">{errors.emailSubFlag}</span>}
            </label>

            <label className={`form-field${errors.preferredAddressForCommunication ? ' has-error' : ''}`}>
              <span className="form-label">Preferred Address For Communication</span>
              <select className="form-input" value={form.preferredAddressForCommunication} onChange={(e) => handleChange('preferredAddressForCommunication', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="O">O</option>
                <option value="I">I</option>
              </select>
              {errors.preferredAddressForCommunication && <span className="error-text">{errors.preferredAddressForCommunication}</span>}
            </label>

            <label className={`form-field${errors.emailVerificationFlag ? ' has-error' : ''}`}>
              <span className="form-label">Email Verification Flag</span>
              <select className="form-input" value={form.emailVerificationFlag} onChange={(e) => handleChange('emailVerificationFlag', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
              {errors.emailVerificationFlag && <span className="error-text">{errors.emailVerificationFlag}</span>}
            </label>

            <label className={`form-field${errors.mobileVerificationFlag ? ' has-error' : ''}`}>
              <span className="form-label">Mobile Verification Flag</span>
              <select className="form-input" value={form.mobileVerificationFlag} onChange={(e) => handleChange('mobileVerificationFlag', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
              {errors.mobileVerificationFlag && <span className="error-text">{errors.mobileVerificationFlag}</span>}
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
            className={`action-button${Object.keys(errors).length > 0 || !form.pAddrLine1 ? ' disabled' : ' primary'}`}
            onClick={handleNext}
            disabled={Object.keys(errors).length > 0 || !form.pAddrLine1}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default ContactDetails;