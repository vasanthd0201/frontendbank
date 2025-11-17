import React, { useState, useCallback } from 'react';
import '../css/InitialDetails.css';
import { useNavigate } from "react-router-dom";

const InitialDetails = ({ onNext, currentStep = 0, handleBack = () => {} }) => {
   const navigate = useNavigate();
  const [form, setForm] = useState({
    ackId: '',
    pranNumber: '',
    receiptNumber: '',
    sectorTypeFlag: '',
    citizenFlag: '',
    combinedFormFlag: '',
    popSpRegNo: '',
    nriBankAccountStatus: '',
    countryOfResidency: '',
    nationality: '',
    consentByPop: '',
    howDidYouHearAboutNps: '',
    minUploadIndicat: '',
    pregeneratedPranFlag: '',
    productExistingCustomer: '',
    existingCustomerBranchOffice: '',
    popSeCode: '',
    popSeAgentName: '',
    popSeEmployeeId: '',
  });

  const [errors, setErrors] = useState({});

  /* ---------- VALIDATION ---------- */
  const validateField = useCallback(
    (name, value) => {
      const newErr = { ...errors };
      delete newErr[name];

      // …(same validation logic you already have)…
      // (kept unchanged for brevity – copy-paste your original switch)

      setErrors(newErr);
    },
    [errors]
  );

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

const validateAll = () => {
  return Object.keys(errors).length === 0 && requiredFilled;
};

  /* ---------- OUTPUT JSON ---------- */
  const getOutputJSON = () => ({
    ackId: form.ackId.trim(),
    pranNumber: null,
    receiptNumber: form.receiptNumber || null,
    sectorTypeFlag: form.sectorTypeFlag,
    citizenFlag: form.citizenFlag,
    combinedFormFlag: form.combinedFormFlag,
    popSpRegNo: form.popSpRegNo.trim(),
    nriBankAccountStatus: form.nriBankAccountStatus,
    countryOfRes: form.countryOfResidency.trim(),
    nationality: form.nationality.trim(),
    consentByPOP: form.consentByPop,
    howDidYouHearAboutNps: form.howDidYouHearAboutNps,
    minUploadIndicat: form.minUploadIndicat,
    pregeneratedPranFlag: form.pregeneratedPranFlag,
    productForExistingCustomer: form.productExistingCustomer || null,
    existingCustomerBranchOffice: form.existingCustomerBranchOffice || null,
    popSeCode: form.popSeCode || null,
    popSeAgentName: form.popSeAgentName || null,
    popSeEmployeeId: form.popSeEmployeeId || null,
  });

  /* ---------- NEXT BUTTON LOGIC ---------- */
  const requiredFilled =
    form.ackId &&
    form.sectorTypeFlag &&
    form.citizenFlag &&
    form.combinedFormFlag &&
    form.popSpRegNo &&
    form.countryOfResidency &&
    form.nationality &&
    form.consentByPop &&
    form.minUploadIndicat &&
    form.pregeneratedPranFlag;

  const nextDisabled = Object.keys(errors).length > 0 || !requiredFilled;

  const handleNext = () => {
    if (validateAll()) {
      const payload = getOutputJSON();
      localStorage.setItem('initialDetails', JSON.stringify(payload));
      if (onNext) onNext(payload);
      navigate("/registration/personal");
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="app-main">
      <section className="form-card">
        <h2>Initial Details</h2>

        {/* ---------- SINGLE ROW ---------- */}
        <div className="form-row">
          {/* Ack Id */}
          <div className={`form-field${errors.ackId ? ' has-error' : ''}`}>
            <label className="form-label">
              Ack Id <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={form.ackId}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '');
                handleChange('ackId', v);
              }}
              placeholder="17 digit number"
              inputMode="numeric"
              maxLength={17}
            />
            {errors.ackId && <span className="error-text">{errors.ackId}</span>}
          </div>

          {/* PRAN Number */}
          <div className={`form-field${errors.pranNumber ? ' has-error' : ''}`}>
            <label className="form-label">Pran Number</label>
            <input
              type="text"
              className="form-input"
              value={form.pranNumber}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 12);
                handleChange('pranNumber', v);
              }}
              maxLength={12}
              placeholder="12 digit number"
              disabled
            />
            {errors.pranNumber && (
              <span className="error-text">{errors.pranNumber}</span>
            )}
          </div>

          {/* Receipt Number */}
          <div className={`form-field${errors.receiptNumber ? ' has-error' : ''}`}>
            <label className="form-label">Receipt Number</label>
            <input
              type="text"
              className="form-input"
              value={form.receiptNumber}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 17);
                handleChange('receiptNumber', v);
              }}
              maxLength={17}
              placeholder="17 digit number"
            />
            {errors.receiptNumber && (
              <span className="error-text">{errors.receiptNumber}</span>
            )}
          </div>

          {/* Sector Type Flag */}
          <div className={`form-field${errors.sectorTypeFlag ? ' has-error' : ''}`}>
            <label className="form-label">
              Sector Type Flag <span className="required">*</span>
            </label>
            <select
              className="form-input"
              value={form.sectorTypeFlag}
              onChange={(e) => handleChange('sectorTypeFlag', e.target.value)}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="U">U - Unorganized Sector</option>
              <option value="C">C - Corporate Sector</option>
            </select>
            {errors.sectorTypeFlag && (
              <span className="error-text">{errors.sectorTypeFlag}</span>
            )}
          </div>

          {/* Citizen Flag */}
          <div className={`form-field${errors.citizenFlag ? ' has-error' : ''}`}>
            <label className="form-label">
              Citizen Flag <span className="required">*</span>
            </label>
            <select
              className="form-input"
              value={form.citizenFlag}
              onChange={(e) => handleChange('citizenFlag', e.target.value)}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="Y">Y - NRI</option>
              <option value="N">N - Resident Indian</option>
              <option value="O">O - OCI</option>
            </select>
            {errors.citizenFlag && (
              <span className="error-text">{errors.citizenFlag}</span>
            )}
          </div>

          {/* Combined Form Flag */}
          <div className={`form-field${errors.combinedFormFlag ? ' has-error' : ''}`}>
            <label className="form-label">
              Combined Form Flag <span className="required">*</span>
            </label>
            <select
              className="form-input"
              value={form.combinedFormFlag}
              onChange={(e) => handleChange('combinedFormFlag', e.target.value)}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="N">N - Tier I only</option>
              <option value="Y">Y - Tier I & Tier II</option>
            </select>
            {errors.combinedFormFlag && (
              <span className="error-text">{errors.combinedFormFlag}</span>
            )}
          </div>

          {/* Pop Sp Reg No */}
          <div className={`form-field${errors.popSpRegNo ? ' has-error' : ''}`}>
            <label className="form-label">
              Pop Sp Reg No <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={form.popSpRegNo}
              onChange={(e) => handleChange('popSpRegNo', e.target.value)}
            />
            {errors.popSpRegNo && (
              <span className="error-text">{errors.popSpRegNo}</span>
            )}
          </div>

          {/* NRI Bank Account Status */}
          <div className={`form-field${errors.nriBankAccountStatus ? ' has-error' : ''}`}>
            <label className="form-label">NRI Bank Account Status</label>
            <select
              className="form-input"
              value={form.nriBankAccountStatus}
              onChange={(e) =>
                handleChange('nriBankAccountStatus', e.target.value)
              }
            >
              <option value="" disabled>
                RP or NP
              </option>
              <option value="RP">RP</option>
              <option value="NP">NP</option>
            </select>
            {errors.nriBankAccountStatus && (
              <span className="error-text">{errors.nriBankAccountStatus}</span>
            )}
          </div>

          {/* Country Of Residency */}
          <div className={`form-field${errors.countryOfResidency ? ' has-error' : ''}`}>
            <label className="form-label">
              Country Of Residency <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={form.countryOfResidency}
              onChange={(e) => handleChange('countryOfResidency', e.target.value)}
            />
            {errors.countryOfResidency && (
              <span className="error-text">{errors.countryOfResidency}</span>
            )}
          </div>

          {/* Nationality */}
          <div className={`form-field${errors.nationality ? ' has-error' : ''}`}>
            <label className="form-label">
              Nationality <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={form.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
            />
            {errors.nationality && (
              <span className="error-text">{errors.nationality}</span>
            )}
          </div>

          {/* Consent By POP */}
          <div className={`form-field${errors.consentByPop ? ' has-error' : ''}`}>
            <label className="form-label">
              Consent By POP <span className="required">*</span>
            </label>
            <select
              className="form-input"
              value={form.consentByPop}
              onChange={(e) => handleChange('consentByPop', e.target.value)}
            >
              <option value="" disabled>
                Yes or No
              </option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
            {errors.consentByPop && (
              <span className="error-text">{errors.consentByPop}</span>
            )}
          </div>

          {/* How Did You Hear About NPS */}
          <div className={`form-field${errors.howDidYouHearAboutNps ? ' has-error' : ''}`}>
            <label className="form-label">How Did You Hear About NPS</label>
            <select
              className="form-input"
              value={form.howDidYouHearAboutNps}
              onChange={(e) =>
                handleChange('howDidYouHearAboutNps', e.target.value)
              }
            >
              <option value="" disabled>
                Select
              </option>
              <option value="Advertisement">Advertisement</option>
              <option value="Advisor">Advisor</option>
              <option value="Internet">Internet</option>
              <option value="Other">Other</option>
            </select>
            {errors.howDidYouHearAboutNps && (
              <span className="error-text">{errors.howDidYouHearAboutNps}</span>
            )}
          </div>

          {/* Min Upload Indicat */}
          <div className={`form-field${errors.minUploadIndicat ? ' has-error' : ''}`}>
            <label className="form-label">
              Min Upload Indicat <span className="required">*</span>
            </label>
            <select
              className="form-input"
              value={form.minUploadIndicat}
              onChange={(e) => handleChange('minUploadIndicat', e.target.value)}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
            {errors.minUploadIndicat && (
              <span className="error-text">{errors.minUploadIndicat}</span>
            )}
          </div>

          {/* Pregenerated Pran Flag */}
          <div className={`form-field${errors.pregeneratedPranFlag ? ' has-error' : ''}`}>
            <label className="form-label">
              Pregenerated Pran Flag <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={form.pregeneratedPranFlag}
              onChange={(e) => handleChange('pregeneratedPranFlag', e.target.value)}
              placeholder="Must be 1"
            />
            {errors.pregeneratedPranFlag && (
              <span className="error-text">{errors.pregeneratedPranFlag}</span>
            )}
          </div>

          {/* Product Existing Customer */}
          <div className="form-field">
            <label className="form-label">Product Existing Customer</label>
            <input
              type="text"
              className="form-input"
              value={form.productExistingCustomer}
              onChange={(e) =>
                handleChange('productExistingCustomer', e.target.value)
              }
            />
          </div>

          {/* Existing Customer BranchOffice */}
          <div className="form-field">
            <label className="form-label">Existing Customer BranchOffice</label>
            <input
              type="text"
              className="form-input"
              value={form.existingCustomerBranchOffice}
              onChange={(e) =>
                handleChange('existingCustomerBranchOffice', e.target.value)
              }
            />
          </div>

          {/* Pop Se Code */}
          <div className="form-field">
            <label className="form-label">Pop Se Code</label>
            <input
              type="text"
              className="form-input"
              value={form.popSeCode}
              onChange={(e) => handleChange('popSeCode', e.target.value)}
            />
          </div>

          {/* PopSe Agent Name */}
          <div className="form-field">
            <label className="form-label">PopSe Agent Name</label>
            <input
              type="text"
              className="form-input"
              value={form.popSeAgentName}
              onChange={(e) => handleChange('popSeAgentName', e.target.value)}
            />
          </div>

          {/* PopSe Employee Id */}
          <div className="form-field">
            <label className="form-label">PopSe Employee Id</label>
            <input
              type="text"
              className="form-input"
              value={form.popSeEmployeeId}
              onChange={(e) => handleChange('popSeEmployeeId', e.target.value)}
            />
          </div>
        </div>
        {/* ---------- END SINGLE ROW ---------- */}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="action-button secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </button>
          <button
            type="button"
            className={`action-button${nextDisabled ? ' disabled' : ' primary'}`}
            onClick={handleNext}
            disabled={nextDisabled}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default InitialDetails;