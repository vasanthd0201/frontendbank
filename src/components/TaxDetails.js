import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TaxDetails.css';

const emptyFatcaItem = () => ({
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

const TaxDetails = () => {
  const navigate = useNavigate();

  // ---------- FORM STATE ----------
  const [form, setForm] = useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    orphan: '',
    placeOfBirth: '',
    countryOfBirth: '',
    maritalStatus: '',
    mobile: '',
    email: '',
    telephone: '',
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherLastName: '',
    motherFirstName: '',
    motherMiddleName: '',
    motherLastName: '',
    spouseFirstName: '',
    spouseMiddleName: '',
    spouseLastName: '',
    passportNumber: '',
    voterId: '',
    cersaiId: '',
    retirementAdvId: '',
    idProof: '',
    idProofNumber: '',
    idProofOthers: '',
    dobProof: '',
    dobProofDocNum: '',
    last4Aadhaar: '',
    form60: '',
    form60f: '',
    ePranWelcomePlan: '',
    modeOfRegistration: '',
    npsOnBoarding: '',
    foreignPassportNumber: '',
    visaPermitNo: '',
    productType: '',
    productTypeOther: '',
    hindiSubFlag: '',
    subscriberDeclaration: '',
    employerDeclaration: '',
    existingCustomerPop: '',
    kycVerificationFlag: '',
    panVerificationFlag: '',
    firstNameHindi: '',
    lastNameHindi: '',
    middleNameHindi: '',
    guardianFirstName: '',
    guardianMiddleName: '',
    guardianLastName: '',
    idProofExpiryDate: '',
    kycMode: '',
    choRegNo: '',
    cboRegNo: '',
    popRegNo: '',
    popSpRegNoDeclaration: '',
    modeOfAnnualSot: '',
    sotLangCode: '',

    // FATCA-specific
    declarationOfFatca: '',
    fatcaDeclarationCount: '',
    usPerson: '',
    taxPayerOfCountries: '',
    amlaFlag: '',
    fatcaList: [emptyFatcaItem()]
  });

  const [errors, setErrors] = useState({});

  // Pull guardian info from localStorage if present (used in some rules)
  const guardianPan = typeof window !== 'undefined' ? localStorage.getItem('guardianPan') : null;
  const guardianForm60 = typeof window !== 'undefined' ? localStorage.getItem('guardianForm60') : null;

  // ---------- HELPERS ----------
  const isValidFutureDDMMYYYY = (d) => {
    if (!/^\d{8}$/.test(d)) return false;
    const dd = parseInt(d.slice(0, 2), 10);
    const mm = parseInt(d.slice(2, 4), 10) - 1;
    const yyyy = parseInt(d.slice(4, 8), 10);
    const date = new Date(yyyy, mm, dd);
    if (isNaN(date.getTime())) return false;
    if (date.getFullYear() !== yyyy || date.getMonth() !== mm || date.getDate() !== dd) return false;
    const today = new Date(); today.setHours(0,0,0,0);
    return date > today;
  };

  // Validate a single fatca item partially (used when editing to remove/verify single-field errors)
  const quickValidateFatcaField = (idx, field, value) => {
    const key = `fatcaList[${idx}].${field}`;
    const newErr = { ...errors };
    delete newErr[key]; // clear first

    // quick checks for the fields that are marked required
    if (field === 'taxIdentificationNum') {
      if (!value || value.trim() === '') {
        newErr[key] = 'Tax Identification Number is required';
      } else if (value.length > 20) {
        newErr[key] = 'Max 20 characters';
      } else {
        // guardian PAN / Form60 quick enforcement
        if (guardianPan && value !== guardianPan) {
          newErr[key] = 'When guardian PAN is furnished, this must match guardian PAN';
        }
        if (guardianForm60 === 'Y' && value !== 'Form60') {
          newErr[key] = "If guardian furnished Form60 then this field must contain 'Form60'";
        }
      }
    }

    if (field === 'tinNumIssueCountry') {
      if (!value || value.trim().length !== 2) {
        newErr[key] = 'TIN Issue Country is required and must be 2-letter code';
      }
    }

    if (field === 'countryOfTaxRes') {
      if (!value || value.trim().length !== 2) {
        newErr[key] = 'Country of Tax Residence is required (2-letter code)';
      }
    }

    if (field === 'docValidity' && value) {
      if (!isValidFutureDDMMYYYY(value)) {
        newErr[key] = 'Document validity must be future date in DDMMYYYY';
      }
    }

    setErrors(newErr);
  };

  // Complete validation for a fatca item (used on full form validate)
  const validateFatcaItem = (idx, item, newErrs) => {
    const path = (f) => `fatcaList[${idx}].${f}`;

    if (!item.countryOfTaxRes || item.countryOfTaxRes.trim().length !== 2) {
      newErrs[path('countryOfTaxRes')] = 'Country of Tax Residence is mandatory and must be 2-letter code';
    }

    // For UI we mark taxIdentificationNum and tinNumIssueCountry required; enforce here
    if (!item.taxIdentificationNum || item.taxIdentificationNum.trim() === '') {
      newErrs[path('taxIdentificationNum')] = 'Tax Identification Number is mandatory';
    } else if (item.taxIdentificationNum.length > 20) {
      newErrs[path('taxIdentificationNum')] = 'Max 20 characters';
    } else {
      if (guardianPan && item.taxIdentificationNum !== guardianPan) {
        newErrs[path('taxIdentificationNum')] = 'When guardian PAN is furnished, this must match guardian PAN';
      }
      if (guardianForm60 === 'Y' && item.taxIdentificationNum !== 'Form60') {
        newErrs[path('taxIdentificationNum')] = "If guardian furnished Form60 then this field must contain 'Form60'";
      }
    }

    if (!item.tinNumIssueCountry || item.tinNumIssueCountry.trim().length !== 2) {
      newErrs[path('tinNumIssueCountry')] = 'TIN Issue Country is mandatory and must be 2-letter code';
    }

    // addrOfTaxRes length
    if (item.addrOfTaxRes && item.addrOfTaxRes.length > 100) {
      newErrs[path('addrOfTaxRes')] = 'Max 100 characters';
    }

    // citizenshipDocFlag rules when born in US and usPerson = N
    const usPerson = form.usPerson === 'Y';
    if (!usPerson && (form.countryOfBirth || '').toUpperCase() === 'US') {
      if (!item.citizenshipDocFlag || !['Y','N'].includes(item.citizenshipDocFlag)) {
        newErrs[path('citizenshipDocFlag')] = 'Citizenship Document Flag required (Y/N) when applicant born in US';
      } else {
        if (item.citizenshipDocFlag === 'N' && (!item.reasonForNoEvidence || item.reasonForNoEvidence.trim() === '')) {
          newErrs[path('reasonForNoEvidence')] = 'Reason for No Evidence is mandatory when citizenshipDocFlag is N';
        }
        if (item.citizenshipDocFlag === 'Y' && item.docValidity && !isValidFutureDDMMYYYY(item.docValidity)) {
          newErrs[path('docValidity')] = 'Document validity must be future date in DDMMYYYY';
        }
      }
    } else {
      if (item.docValidity && !isValidFutureDDMMYYYY(item.docValidity)) {
        newErrs[path('docValidity')] = 'Document validity must be future date in DDMMYYYY';
      }
    }

    // State/City/Zip conditional checks (if countryOfTaxRes != IN)
    const countryTaxResIN = (item.countryOfTaxRes || '').toUpperCase() === 'IN';
    if (!countryTaxResIN) {
      if (!item.fatcaState || item.fatcaState.trim() === '') newErrs[path('fatcaState')] = 'State is mandatory when Country of Tax Residence is not IN';
      else if (item.fatcaState.length > 30) newErrs[path('fatcaState')] = 'Max 30 characters';
      if (!item.fatcaCity || item.fatcaCity.trim() === '') newErrs[path('fatcaCity')] = 'City is mandatory when Country of Tax Residence is not IN';
      else if (item.fatcaCity.length > 30) newErrs[path('fatcaCity')] = 'Max 30 characters';
      if (!item.zipcode || !/^\d{1,10}$/.test(item.zipcode)) newErrs[path('zipcode')] = 'Zipcode required (numeric up to 10 digits) when Country of Tax Residence is not IN';
    } else {
      if (item.fatcaState && item.fatcaState.length > 30) newErrs[path('fatcaState')] = 'Max 30 characters';
      if (item.fatcaCity && item.fatcaCity.length > 30) newErrs[path('fatcaCity')] = 'Max 30 characters';
      if (item.zipcode && !/^\d{1,10}$/.test(item.zipcode)) newErrs[path('zipcode')] = 'Zipcode must be numeric and up to 10 digits';
    }
  };

  // ---------- FIELD VALIDATION (top-level) ----------
  const validateField = useCallback((name, value) => {
    const newErr = { ...errors };
    delete newErr[name];

    if (name === 'declarationOfFatca') {
      if (!value) newErr[name] = 'Declaration of FATCA is required';
      else if (value !== 'Y') newErr[name] = "For new registration Declaration of FATCA must be 'Y'";
    }

    if (name === 'fatcaDeclarationCount') {
      if (!value) newErr[name] = 'FATCA Declaration Count is required';
      else if (!/^[123]$/.test(value)) newErr[name] = 'Allowed values: 1, 2 or 3';
    }

    if (name === 'usPerson') {
      if (!value) newErr[name] = 'US Person flag is mandatory';
      else if (!['Y','N'].includes(value)) newErr[name] = 'Must be Y or N';
    }

    if (name === 'amlaFlag') {
      if (!value) newErr[name] = 'AMLA Flag is mandatory';
      else if (value !== 'Y') newErr[name] = "AMLA Flag must be 'Y'";
    }

    setErrors(newErr);
  }, [errors]);

  // ---------- CHANGE HANDLERS ----------
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);

    // If we changed countryOfBirth or usPerson it can impact fatca entries - clear fatca-related errors
    if (name === 'countryOfBirth' || name === 'usPerson') {
      const cleaned = { ...errors };
      Object.keys(cleaned).forEach(k => {
        if (k.startsWith('fatcaList[')) delete cleaned[k];
      });
      setErrors(cleaned);
    }
  };

  // fatca item change: clear that specific error and do quick validation
  const handleFatcaChange = (idx, field, value) => {
    const list = [...form.fatcaList];
    list[idx] = { ...list[idx], [field]: value };
    setForm((prev) => ({ ...prev, fatcaList: list }));

    // Immediately clear any existing error for this specific field
    const key = `fatcaList[${idx}].${field}`;
    const newErr = { ...errors };
    delete newErr[key];
    setErrors(newErr);

    // run quick validation for required-marked fields or format checks
    quickValidateFatcaField(idx, field, value);
  };

  // ---------- FULL FORM VALIDATION ----------
  const validateAll = () => {
    const newErrs = {};

    if (!form.declarationOfFatca) newErrs.declarationOfFatca = 'Declaration of FATCA is required';
    else if (form.declarationOfFatca !== 'Y') newErrs.declarationOfFatca = "Declaration must be 'Y' for new registration";

    if (!form.fatcaDeclarationCount) newErrs.fatcaDeclarationCount = 'FATCA Declaration Count is required';
    else if (!/^[123]$/.test(form.fatcaDeclarationCount)) newErrs.fatcaDeclarationCount = 'Allowed values: 1, 2 or 3';

    if (!form.usPerson) newErrs.usPerson = 'US Person flag is mandatory (Y/N)';
    else if (!['Y','N'].includes(form.usPerson)) newErrs.usPerson = 'Must be Y or N';

    if (!form.amlaFlag) newErrs.amlaFlag = 'AMLA flag is mandatory';
    else if (form.amlaFlag !== 'Y') newErrs.amlaFlag = "AMLA Flag must be 'Y'";

    if (!Array.isArray(form.fatcaList) || form.fatcaList.length === 0) {
      newErrs.fatcaList = 'At least one FATCA entry is required';
    } else {
      form.fatcaList.forEach((item, idx) => validateFatcaItem(idx, item, newErrs));
    }

    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  // ---------- OUTPUT JSON ----------
  const getOutputJSON = () => ({
    declarationOfFatca: form.declarationOfFatca,
    fatcaDeclarationCount: form.fatcaDeclarationCount,
    usPerson: form.usPerson,
    taxPayerOfCountries: form.taxPayerOfCountries,
    amlaFlag: form.amlaFlag,
    fatcaList: form.fatcaList.map((f) => ({ ...f }))
  });

  // ---------- BUTTON HANDLERS ----------
  const handleNext = () => {
    if (validateAll()) {
      const payload = getOutputJSON();
      localStorage.setItem('fatcaDetails', JSON.stringify(payload));
      navigate('/registration/bank');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handleBack = () => navigate('/registration/contact');

  // Add / Remove FATCA entries
  const addFatcaEntry = () => setForm((prev) => ({ ...prev, fatcaList: [...prev.fatcaList, emptyFatcaItem()] }));
  const removeFatcaEntry = (idx) => {
    setForm((prev) => ({ ...prev, fatcaList: prev.fatcaList.filter((_, i) => i !== idx) }));
    const cleaned = { ...errors };
    Object.keys(cleaned).forEach(k => {
      if (k.startsWith(`fatcaList[${idx}]`)) delete cleaned[k];
    });
    setErrors(cleaned);
  };

  // Next button disabled logic: block if top-level errors present OR missing required UI-marked fields
  const hasErrors = Object.keys(errors).length > 0;
  const missingRequiredFatcaListFields = form.fatcaList.some(item =>
    !form.fatcaDeclarationCount ||
    !item.taxIdentificationNum || item.taxIdentificationNum.trim() === '' ||
    !item.tinNumIssueCountry || item.tinNumIssueCountry.trim() === ''
  );
  const disableNext = hasErrors || !form.declarationOfFatca || missingRequiredFatcaListFields;

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
                aria-required
              >
                <option value="" disabled>Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
              {errors.declarationOfFatca && <span className="error-text">{errors.declarationOfFatca}</span>}
            </label>

            {/* FATCA Declaration Count (marked required) */}
            <label className={`form-field${errors.fatcaDeclarationCount ? ' has-error' : ''}`}>
              <span className="form-label">FATCA Declaration Count <span className="required">*</span></span>
              <input
                type="text"
                className="form-input"
                value={form.fatcaDeclarationCount}
                onChange={(e) => handleChange('fatcaDeclarationCount', e.target.value.replace(/\D/g, '').slice(0,1))}
                placeholder="Enter 1, 2 or 3"
                aria-required
              />
              {errors.fatcaDeclarationCount && <span className="error-text">{errors.fatcaDeclarationCount}</span>}
            </label>

            {/* US Person */}
            <label className={`form-field${errors.usPerson ? ' has-error' : ''}`}>
              <span className="form-label">US Person <span className="required">*</span></span>
              <select
                className="form-input"
                value={form.usPerson}
                onChange={(e) => handleChange('usPerson', e.target.value)}
                aria-required
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
                onChange={(e) => handleChange('taxPayerOfCountries', e.target.value.toUpperCase().slice(0,1))}
                placeholder="I (India) or M (Multiple)"
              />
              {errors.taxPayerOfCountries && <span className="error-text">{errors.taxPayerOfCountries}</span>}
            </label>

            {/* AMLA Flag */}
            <label className={`form-field${errors.amlaFlag ? ' has-error' : ''}`}>
              <span className="form-label">AMLA Flag <span className="required">*</span></span>
              <select
                className="form-input"
                value={form.amlaFlag}
                onChange={(e) => handleChange('amlaFlag', e.target.value)}
                aria-required
              >
                <option value="" disabled>Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
              {errors.amlaFlag && <span className="error-text">{errors.amlaFlag}</span>}
            </label>
          </div>
        </div>

        {/* FATCA LIST entries */}
        <div className="form-section">
          <h3>FATCA List (Tax Residences)</h3>
          {errors.fatcaList && <div className="error-text">{errors.fatcaList}</div>}
          {form.fatcaList.map((item, idx) => (
            <div key={idx} className="fatca-item card">
              <div className="form-grid">
                <label className={`form-field${errors[`fatcaList[${idx}].countryOfTaxRes`] ? ' has-error' : ''}`}>
                  <span className="form-label">Country of Tax Residence <span className="required">*</span></span>
                  <input
                    type="text"
                    className="form-input"
                    value={item.countryOfTaxRes}
                    onChange={(e) => handleFatcaChange(idx, 'countryOfTaxRes', e.target.value.toUpperCase().slice(0,2))}
                    placeholder="e.g. IN"
                    maxLength={2}
                    aria-required
                  />
                  {errors[`fatcaList[${idx}].countryOfTaxRes`] && <span className="error-text">{errors[`fatcaList[${idx}].countryOfTaxRes`]}</span>}
                </label>

                <label className={`form-field${errors[`fatcaList[${idx}].taxIdentificationNum`] ? ' has-error' : ''}`}>
                  <span className="form-label">Tax Identification Number <span className="required">*</span></span>
                  <input
                    type="text"
                    className="form-input"
                    value={item.taxIdentificationNum}
                    onChange={(e) => handleFatcaChange(idx, 'taxIdentificationNum', e.target.value.slice(0,20))}
                    placeholder="Enter Tax ID (max 20 chars)"
                    aria-required
                  />
                  {errors[`fatcaList[${idx}].taxIdentificationNum`] && <span className="error-text">{errors[`fatcaList[${idx}].taxIdentificationNum`]}</span>}
                </label>

                <label className={`form-field${errors[`fatcaList[${idx}].tinNumIssueCountry`] ? ' has-error' : ''}`}>
                  <span className="form-label">TIN Issue Country <span className="required">*</span></span>
                  <input
                    type="text"
                    className="form-input"
                    value={item.tinNumIssueCountry}
                    onChange={(e) => handleFatcaChange(idx, 'tinNumIssueCountry', e.target.value.toUpperCase().slice(0,2))}
                    placeholder="e.g. IN"
                    maxLength={2}
                    aria-required
                  />
                  {errors[`fatcaList[${idx}].tinNumIssueCountry`] && <span className="error-text">{errors[`fatcaList[${idx}].tinNumIssueCountry`]}</span>}
                </label>

                <label className={`form-field${errors[`fatcaList[${idx}].addrOfTaxRes`] ? ' has-error' : ''}`}>
                  <span className="form-label">Address of Tax Residence</span>
                  <input
                    type="text"
                    className="form-input"
                    value={item.addrOfTaxRes}
                    onChange={(e) => handleFatcaChange(idx, 'addrOfTaxRes', e.target.value.slice(0,100))}
                    placeholder="Address (up to 100 chars)"
                  />
                  {errors[`fatcaList[${idx}].addrOfTaxRes`] && <span className="error-text">{errors[`fatcaList[${idx}].addrOfTaxRes`]}</span>}
                </label>

                <label className={`form-field${errors[`fatcaList[${idx}].citizenshipDocFlag`] ? ' has-error' : ''}`}>
                  <span className="form-label">Citizenship Document Flag</span>
                  <select
                    className="form-input"
                    value={item.citizenshipDocFlag}
                    onChange={(e) => handleFatcaChange(idx, 'citizenshipDocFlag', e.target.value)}
                  >
                    <option value="" disabled>Select</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                  {errors[`fatcaList[${idx}].citizenshipDocFlag`] && <span className="error-text">{errors[`fatcaList[${idx}].citizenshipDocFlag`]}</span>}
                </label>

                <label className={`form-field${errors[`fatcaList[${idx}].docValidity`] ? ' has-error' : ''}`}>
                  <span className="form-label">Document Validity</span>
                  <input
                    type="text"
                    className="form-input"
                    value={item.docValidity}
                    onChange={(e) => handleFatcaChange(idx, 'docValidity', e.target.value.replace(/\D/g,'').slice(0,8))}
                    placeholder="DDMMYYYY (future date)"
                  />
                  {errors[`fatcaList[${idx}].docValidity`] && <span className="error-text">{errors[`fatcaList[${idx}].docValidity`]}</span>}
                </label>

                <label className={`form-field${errors[`fatcaList[${idx}].reasonForNoEvidence`] ? ' has-error' : ''}`}>
                  <span className="form-label">Reason for No Evidence</span>
                  <input
                    type="text"
                    className="form-input"
                    value={item.reasonForNoEvidence}
                    onChange={(e) => handleFatcaChange(idx, 'reasonForNoEvidence', e.target.value.slice(0,200))}
                    placeholder="Reason (if citizenship doc flag = N)"
                  />
                  {errors[`fatcaList[${idx}].reasonForNoEvidence`] && <span className="error-text">{errors[`fatcaList[${idx}].reasonForNoEvidence`]}</span>}
                </label>

                <label className={`form-field${errors[`fatcaList[${idx}].fatcaState`] ? ' has-error' : ''}`}>
                  <span className="form-label">FATCA State</span>
                  <input
                    type="text"
                    className="form-input"
                    value={item.fatcaState}
                    onChange={(e) => handleFatcaChange(idx, 'fatcaState', e.target.value.slice(0,30))}
                    placeholder="State (if country != IN)"
                  />
                  {errors[`fatcaList[${idx}].fatcaState`] && <span className="error-text">{errors[`fatcaList[${idx}].fatcaState`]}</span>}
                </label>

                <label className={`form-field${errors[`fatcaList[${idx}].fatcaCity`] ? ' has-error' : ''}`}>
                  <span className="form-label">FATCA City</span>
                  <input
                    type="text"
                    className="form-input"
                    value={item.fatcaCity}
                    onChange={(e) => handleFatcaChange(idx, 'fatcaCity', e.target.value.slice(0,30))}
                    placeholder="City (if country != IN)"
                  />
                  {errors[`fatcaList[${idx}].fatcaCity`] && <span className="error-text">{errors[`fatcaList[${idx}].fatcaCity`]}</span>}
                </label>

                <label className={`form-field${errors[`fatcaList[${idx}].zipcode`] ? ' has-error' : ''}`}>
                  <span className="form-label">Zipcode</span>
                  <input
                    type="text"
                    className="form-input"
                    value={item.zipcode}
                    onChange={(e) => handleFatcaChange(idx, 'zipcode', e.target.value.replace(/\D/g,'').slice(0,10))}
                    placeholder="Numeric up to 10 digits"
                  />
                  {errors[`fatcaList[${idx}].zipcode`] && <span className="error-text">{errors[`fatcaList[${idx}].zipcode`]}</span>}
                </label>
              </div>

              <div className="fatca-actions">
                {form.fatcaList.length > 1 && (
                  <button type="button" className="action-button secondary" onClick={() => removeFatcaEntry(idx)}>Remove</button>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 8 }}>
            <button type="button" className="action-button" onClick={addFatcaEntry}>Add another country</button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="action-button secondary" onClick={handleBack}>
            Back
          </button>
          <button
            type="button"
            className={`action-button ${disableNext ? ' disabled' : ' primary'}`}
            onClick={handleNext}
            disabled={disableNext}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default TaxDetails;
