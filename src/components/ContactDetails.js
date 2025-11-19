// src/components/ContactDetails.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import states from '../data/states.json';
import countries from '../data/countries.json';
import poaCodes from '../data/poaCodes.json';
import '../css/ContactDetails.css';

/**
 * ContactDetails.js
 * - Loads states & countries & poaCodes from JSON (Option B)
 * - Implements validation rules from PDF + Excel D019-D022
 *
 * Assumptions:
 * - localStorage.citizenFlag exists and is 'Y' (NRI), 'N' (RI) or 'O' (OCI). If absent defaults to 'N'.
 * - JSON files exist under src/data/
 *
 * Key rules implemented:
 * - D019-D022 correspondence address rules (mandatory for NRI/OCI, blank for RI)
 * - If cAddrLine1 provided then cState, cCountry, cPincode become mandatory
 * - NRI correspondence country cannot be IN; OCI correspondence country must be IN
 * - Permanent address must follow RI/NRI/OCI rules (country/state/pincode constraints)
 * - pAddrProof and cAddrProof use poaCodes; if pAddrProof === '333' then addrProofDocName required
 * - If cAddrProof === '161' and citizenFlag === 'O' then cAddrProofDocNo required
 * - SMS/Email default to 'Y'
 */

const DEFAULT_SMS = 'Y';
const DEFAULT_EMAIL = 'Y';
const SIX_DIGIT_NUMERIC = /^\d{6}$/;
const UPTEN_ALNUM_SPECIAL = /^[a-zA-Z0-9'()\-\/\\,.\s_@#+$&]*$/; // permissive set for NRI/OCI PINs

const ContactDetails = () => {
  const navigate = useNavigate();

  const citizenFlag = (localStorage.getItem('citizenFlag') || 'N').toUpperCase(); // 'Y' | 'N' | 'O'

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
    cAddrProofDocNo: '',
    pAddrLine1: '',
    pAddrLine2: '',
    pAddrLine3: '',
    pAddrLine4: '',
    pState: '',
    pCountry: '',
    pPincode: '',
    pAddrProof: '',
    addrProofDocName: '',
    foreignAddressStateForNRI: '',
    smsSubFlag: DEFAULT_SMS,
    emailSubFlag: DEFAULT_EMAIL,
    preferredAddressForCommunication: '',
    emailVerificationFlag: 'N',
    mobileVerificationFlag: 'N'
  });

  const [errors, setErrors] = useState({});

  const getCountry = (code) => countries.find(c => c.code === code);

  // update state for input changes and validate field immediately
  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value, { formSnapshot: { ...form, [name]: value } });
  };

  // Validate single field. formSnapshot optional to validate cross-field logic instantly.
  const validateField = (name, value, opts = {}) => {
    const currentForm = opts.formSnapshot || form;
    const newErr = { ...errors };
    delete newErr[name];

    const trimmed = typeof value === 'string' ? value.trim() : value;

    // ---------- Correspondence address lines (D019 - D022) ----------
    if (['cAddrLine1', 'cAddrLine2', 'cAddrLine3', 'cAddrLine4'].includes(name)) {
      if (citizenFlag === 'N') {
        if (trimmed !== '') newErr[name] = 'Must be blank for Resident Indian (RI)';
      } else {
        if (!trimmed) newErr[name] = 'Mandatory for NRI / OCI';
        else if (trimmed.length > 60) newErr[name] = 'Max 60 characters';
      }
    }

    // cState
    if (name === 'cState') {
      const t = trimmed;
      if (citizenFlag === 'N') {
        if (t) newErr[name] = 'Correspondence State must be blank for RI';
      } else {
        if (!t) newErr[name] = 'Correspondence State is mandatory for NRI/OCI';
        else if (t.length > 2) newErr[name] = 'Invalid state code';
        // For NRI some systems expect 99; we'll warn but not hard-block unless business needs
        if (citizenFlag === 'Y' && t !== '99') {
          // optional: newErr[name] = 'For NRI correspondence state code should be 99';
        }
      }
    }

    // cCountry
    if (name === 'cCountry') {
      const t = trimmed;
      if (citizenFlag === 'N') {
        if (t) newErr[name] = 'Correspondence Country must be blank for RI';
      } else {
        if (!t) newErr[name] = 'Correspondence Country is required for NRI/OCI';
        else if (t.length > 2) newErr[name] = 'Invalid country code';
        else {
          if (citizenFlag === 'Y') {
            if (t === 'IN') newErr[name] = 'IN is not allowed for NRI correspondence country';
            const c = getCountry(t);
            if (!c) newErr[name] = 'Unknown country code';
            else if (c.nriFlag !== 'Y') newErr[name] = 'Selected country is not permitted for NRI';
          }
          if (citizenFlag === 'O') {
            if (t !== 'IN') {
              newErr[name] = 'For OCI correspondence country must be IN';
            }
          }
        }
      }
    }

    // cPincode
    if (name === 'cPincode') {
      const t = trimmed;
      if (citizenFlag === 'N') {
        if (t) newErr[name] = 'Correspondence Pincode must be blank for Resident Indian';
      } else if (citizenFlag === 'Y') {
        if (!t) newErr[name] = 'Correspondence Pincode required for NRI';
        else if (t.length > 10 || !UPTEN_ALNUM_SPECIAL.test(t)) newErr[name] = 'Invalid format: up to 10 alphanumeric/special characters allowed for NRI';
        if (['999999', '888888'].includes(t)) newErr[name] = 'Invalid pincode';
      } else if (citizenFlag === 'O') {
        if (!t) newErr[name] = 'Correspondence Pincode required for OCI';
        else if (t.length > 10 || !UPTEN_ALNUM_SPECIAL.test(t)) newErr[name] = 'Invalid OCI pincode';
      }
    }

    // cAddrProof
    if (name === 'cAddrProof') {
      const t = trimmed;
      if (citizenFlag === 'O') {
        if (!t) newErr[name] = 'Correspondence Address Proof is mandatory for OCI';
        else if (t.length > 3) newErr[name] = 'Invalid code';
      } else {
        // filler for RI; for NRI should be mandatory based on existing customer flag - but base rule: for NRI/NRI often mandatory
        // We won't error for NRI here, full-check is in validateAll if needed.
      }
    }

    if (name === 'cAddrProofName') {
      if (trimmed && trimmed.length > 30) newErr[name] = 'Max 30 characters';
    }

    // Permanent address fields
    if (name === 'pAddrLine1') {
      if (!trimmed) newErr[name] = 'Permanent Address Line 1 is required';
      else if (trimmed.length > 60) newErr[name] = 'Max 60 characters';
    }
    if (name === 'pAddrLine2' && trimmed && trimmed.length > 60) newErr[name] = 'Max 60 characters';
    if (name === 'pAddrLine3' && trimmed && trimmed.length > 60) newErr[name] = 'Max 60 characters';
    if (name === 'pAddrLine4' && trimmed && trimmed.length > 60) newErr[name] = 'Max 60 characters';

    // pState
    if (name === 'pState') {
      const t = trimmed;
      if (!t) newErr[name] = 'Permanent State is required';
      else if (t.length > 2) newErr[name] = 'Invalid state code';
      if ((citizenFlag === 'Y' || citizenFlag === 'O') && t === '99') {
        newErr[name] = 'State code 99 not allowed for Permanent State for NRI/OCI';
      }
    }

    // pCountry
    if (name === 'pCountry') {
      const t = trimmed;
      if (!t) newErr[name] = 'Permanent Country is required';
      else {
        if (citizenFlag === 'Y' && t !== 'IN') newErr[name] = 'Permanent Country must be IN for NRI';
        if (citizenFlag === 'O' && t === 'IN') newErr[name] = 'Permanent Country cannot be IN for OCI';
      }
    }

    // pPincode
    if (name === 'pPincode') {
      const t = trimmed;
      if (!t) newErr[name] = 'Permanent Pincode is required';
      else {
        if (citizenFlag === 'N' || citizenFlag === 'Y') {
          if (!SIX_DIGIT_NUMERIC.test(t)) newErr[name] = 'Pin code should be numeric 6 digits for RI/NRI';
          if (['999999', '888888'].includes(t)) newErr[name] = 'Pin code not allowed';
        } else if (citizenFlag === 'O') {
          if (t.length > 10 || !UPTEN_ALNUM_SPECIAL.test(t)) newErr[name] = 'Invalid OCI pincode (up to 10 alphanumeric/special)';
        }
      }
    }

    // pAddrProof
    if (name === 'pAddrProof') {
      const t = trimmed;
      if (!t) newErr[name] = 'Permanent Address Proof is required';
      else if (t.length > 3) newErr[name] = 'Invalid code';
    }

    // cAddrProofDocNo -> Only for OCI when cAddrProof === '161'
    if (name === 'cAddrProofDocNo') {
      const t = trimmed;
      if (citizenFlag === 'O' && currentForm.cAddrProof === '161') {
        if (!t) newErr[name] = 'Correspondence Address Proof Doc No required for OCI when proof code is 161';
        else if (t.length > 30) newErr[name] = 'Max 30 characters';
      }
    }

    // addrProofDocName -> mandatory when pAddrProof === '333'
    if (name === 'addrProofDocName') {
      const t = trimmed;
      if (currentForm.pAddrProof === '333') {
        if (!t) newErr[name] = 'Address Proof Doc Name is mandatory when Address Proof code is 333';
        else if (t.length > 30) newErr[name] = 'Max 30 characters';
      }
    }

    // foreignAddressStateForNRI
    if (name === 'foreignAddressStateForNRI') {
      const t = trimmed;
      if (citizenFlag === 'O') {
        if (!t) newErr[name] = 'Foreign Address State is mandatory for OCI';
        else if (t.length > 30) newErr[name] = 'Max 30 characters';
      } else if (citizenFlag === 'Y') {
        if (t && t.length > 30) newErr[name] = 'Max 30 characters';
      } else {
        // RI filler - no error unless value provided (could be considered invalid)
      }
    }

    // preferredAddressForCommunication
    if (name === 'preferredAddressForCommunication') {
      const t = trimmed;
      if ((citizenFlag === 'Y' || citizenFlag === 'O') && !t) newErr[name] = 'Preferred Address for Communication is mandatory for NRI/OCI';
      if (t && !['O', 'I'].includes(t)) newErr[name] = 'Must be O or I';
    }

    // flags must be Y or N if provided
    if (['smsSubFlag', 'emailSubFlag', 'emailVerificationFlag', 'mobileVerificationFlag'].includes(name)) {
      const t = trimmed;
      if (t && !['Y', 'N'].includes(t)) newErr[name] = 'Must be Y or N';
    }

    setErrors(prev => {
      // combine: remove old error for this field then add new ones
      const combined = { ...prev };
      if (newErr[name]) combined[name] = newErr[name];
      else delete combined[name];
      return combined;
    });

    return newErr;
  };

  // Validate whole form before submission
  const validateAll = () => {
    const newErr = {};

    // mandatory permanent fields always
    const mandatoryPermanent = ['pAddrLine1', 'pState', 'pCountry', 'pPincode', 'pAddrProof'];
    mandatoryPermanent.forEach(f => {
      const val = form[f];
      if (!val || (typeof val === 'string' && val.trim() === '')) newErr[f] = 'Required';
    });

    // NRI/OCI additional mandatory correspondence
    if (citizenFlag === 'Y' || citizenFlag === 'O') {
      ['cAddrLine1', 'cAddrLine2', 'cAddrLine3', 'cAddrLine4', 'cState', 'cCountry', 'cPincode'].forEach(f => {
        const val = form[f];
        if (!val || (typeof val === 'string' && val.trim() === '')) newErr[f] = 'Required for NRI/OCI';
      });
      if (citizenFlag === 'O' && (!form.cAddrProof || form.cAddrProof.trim() === '')) newErr.cAddrProof = 'Required for OCI';
      if (!form.preferredAddressForCommunication || form.preferredAddressForCommunication.trim() === '') newErr.preferredAddressForCommunication = 'Required for NRI/OCI';
    }

    // If cAddrLine1 provided enforce cState,cCountry,cPincode
    if (form.cAddrLine1 && form.cAddrLine1.trim() !== '') {
      if (!form.cState || form.cState.trim() === '') newErr.cState = 'State required when correspondence address provided';
      if (!form.cCountry || form.cCountry.trim() === '') newErr.cCountry = 'Country required when correspondence address provided';
      if (!form.cPincode || form.cPincode.trim() === '') newErr.cPincode = 'Pincode required when correspondence address provided';
    }

    // cAddrProofDocNo mandatory for OCI when cAddrProof == '161'
    if (citizenFlag === 'O' && form.cAddrProof === '161') {
      if (!form.cAddrProofDocNo || form.cAddrProofDocNo.trim() === '') newErr.cAddrProofDocNo = 'Mandatory for OCI when Correspondence Address Proof = 161';
    }

    // addrProofDocName mandatory when pAddrProof == 333
    if (form.pAddrProof === '333') {
      if (!form.addrProofDocName || form.addrProofDocName.trim() === '') newErr.addrProofDocName = 'Mandatory when Address Proof is 333';
    }

    // per-field validations to collect details
    Object.keys(form).forEach(k => {
      const per = validateField(k, form[k], { formSnapshot: form }) || {};
      if (per[k]) newErr[k] = per[k];
    });

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

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
    cAddrProofDocNo: form.cAddrProofDocNo,
    pAddrLine1: form.pAddrLine1,
    pAddrLine2: form.pAddrLine2,
    pAddrLine3: form.pAddrLine3,
    pAddrLine4: form.pAddrLine4,
    pState: form.pState,
    pCountry: form.pCountry,
    pPincode: form.pPincode,
    pAddrProof: form.pAddrProof,
    addrProofDocName: form.addrProofDocName,
    foreignAddressStateForNRI: form.foreignAddressStateForNRI,
    smsSubFlag: form.smsSubFlag,
    emailSubFlag: form.emailSubFlag,
    preferredStyleForCommunication: form.preferredAddressForCommunication,
    emailVerificationFlag: form.emailVerificationFlag,
    mobileVerificationFlag: form.mobileVerificationFlag
  });

  const handleNext = () => {
    if (validateAll()) {
      const payload = getOutputJSON();
      console.log('Contact details payload:', payload);
      localStorage.setItem('contactDetails', JSON.stringify(payload));
      navigate('/registration/fatca');
    } else {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => navigate('/registration/personal');

  useEffect(() => {
    // ensure defaults
    setForm(prev => ({
      ...prev,
      smsSubFlag: prev.smsSubFlag || DEFAULT_SMS,
      emailSubFlag: prev.emailSubFlag || DEFAULT_EMAIL
    }));
  }, []);

  const renderStateOptions = () => states.map(s => <option key={s.code} value={s.code}>{s.code} - {s.name}</option>);
  const renderCountryOptions = () => countries.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>);
  const renderPOAOptions = () => poaCodes.map(p => <option key={p.code} value={p.code}>{p.code} - {p.name}</option>);

  const isRI = citizenFlag === 'N';
  const isNRI = citizenFlag === 'Y';
  const isOCI = citizenFlag === 'O';

  return (
    <div className="app-main">
      <section className="form-card">
        <h2>Contact Details</h2>

        {/* Correspondence Address */}
        <div className="form-section">
          <h3>Correspondence Address</h3>
          <div className="form-grid">

            <label className={`form-field ${errors.cAddrLine1 ? 'has-error' : ''}`}>
              <span className="form-label">Correspondence Address Line 1 {(isNRI || isOCI) && <span className="required">*</span>}</span>
              <input
                type="text"
                className="form-input"
                maxLength={60}
                value={form.cAddrLine1}
                onChange={e => handleChange('cAddrLine1', e.target.value)}
                disabled={isRI}
                placeholder={isRI ? 'Must be blank for Resident Indian' : 'Flat/Room/Door/Block (max 60)'}
              />
              {errors.cAddrLine1 && <span className="error-text">{errors.cAddrLine1}</span>}
            </label>

            <label className={`form-field ${errors.cAddrLine2 ? 'has-error' : ''}`}>
              <span className="form-label">Correspondence Address Line 2 {(isNRI || isOCI) && <span className="required">*</span>}</span>
              <input
                type="text"
                className="form-input"
                maxLength={60}
                value={form.cAddrLine2}
                onChange={e => handleChange('cAddrLine2', e.target.value)}
                disabled={isRI}
                placeholder={isRI ? 'Must be blank for Resident Indian' : 'Premises/Building/Village (max 60)'}
              />
              {errors.cAddrLine2 && <span className="error-text">{errors.cAddrLine2}</span>}
            </label>

            <label className={`form-field ${errors.cAddrLine3 ? 'has-error' : ''}`}>
              <span className="form-label">Correspondence Address Line 3 {(isNRI || isOCI) && <span className="required">*</span>}</span>
              <input
                type="text"
                className="form-input"
                maxLength={60}
                value={form.cAddrLine3}
                onChange={e => handleChange('cAddrLine3', e.target.value)}
                disabled={isRI}
                placeholder={isRI ? 'Must be blank for Resident Indian' : 'Area/Locality/Taluka (max 60)'}
              />
              {errors.cAddrLine3 && <span className="error-text">{errors.cAddrLine3}</span>}
            </label>

            <label className={`form-field ${errors.cAddrLine4 ? 'has-error' : ''}`}>
              <span className="form-label">Correspondence Address Line 4 {(isNRI || isOCI) && <span className="required">*</span>}</span>
              <input
                type="text"
                className="form-input"
                maxLength={60}
                value={form.cAddrLine4}
                onChange={e => handleChange('cAddrLine4', e.target.value)}
                disabled={isRI}
                placeholder={isRI ? 'Must be blank for Resident Indian' : 'City/Town/District (max 60)'}
              />
              {errors.cAddrLine4 && <span className="error-text">{errors.cAddrLine4}</span>}
            </label>

            <label className={`form-field ${errors.cState ? 'has-error' : ''}`}>
              <span className="form-label">Correspondence State {(isNRI || isOCI) && <span className="required">*</span>}</span>
              <select
                className="form-input"
                value={form.cState}
                onChange={e => handleChange('cState', e.target.value)}
                disabled={isRI}
              >
                <option value="">Select</option>
                {renderStateOptions()}
              </select>
              {errors.cState && <span className="error-text">{errors.cState}</span>}
            </label>

            <label className={`form-field ${errors.cCountry ? 'has-error' : ''}`}>
              <span className="form-label">Correspondence Country {(isNRI || isOCI) && <span className="required">*</span>}</span>
              <select
                className="form-input"
                value={form.cCountry}
                onChange={e => handleChange('cCountry', e.target.value)}
                disabled={isRI}
              >
                <option value="">Select</option>
                {renderCountryOptions()}
              </select>
              {errors.cCountry && <span className="error-text">{errors.cCountry}</span>}
            </label>

            <label className={`form-field ${errors.cPincode ? 'has-error' : ''}`}>
              <span className="form-label">Correspondence Pincode {(isNRI || isOCI) && <span className="required">*</span>}</span>
              <input
                type="text"
                className="form-input"
                value={form.cPincode}
                onChange={e => handleChange('cPincode', e.target.value)}
                disabled={isRI}
                maxLength={10}
                placeholder={isRI ? 'Blank for RI' : '6 digits for RI/NRI; up to 10 alnum for OCI'}
              />
              {errors.cPincode && <span className="error-text">{errors.cPincode}</span>}
            </label>

            <label className={`form-field ${errors.cAddrProof ? 'has-error' : ''}`}>
              <span className="form-label">Correspondence Address Proof {isOCI && <span className="required">*</span>}</span>
              <select
                className="form-input"
                value={form.cAddrProof}
                onChange={e => handleChange('cAddrProof', e.target.value)}
                disabled={isRI}
              >
                <option value="">Select Proof</option>
                {renderPOAOptions()}
              </select>
              {errors.cAddrProof && <span className="error-text">{errors.cAddrProof}</span>}
            </label>

            <label className={`form-field ${errors.cAddrProofName ? 'has-error' : ''}`}>
              <span className="form-label">Correspondence Address Proof Name</span>
              <input
                type="text"
                className="form-input"
                value={form.cAddrProofName}
                onChange={e => handleChange('cAddrProofName', e.target.value)}
                disabled={isRI}
                maxLength={30}
              />
              {errors.cAddrProofName && <span className="error-text">{errors.cAddrProofName}</span>}
            </label>

            <label className={`form-field ${errors.cAddrProofDocNo ? 'has-error' : ''}`}>
              <span className="form-label">Correspondence Address Proof Doc No {isOCI && form.cAddrProof === '161' && <span className="required">*</span>}</span>
              <input
                type="text"
                className="form-input"
                value={form.cAddrProofDocNo}
                onChange={e => handleChange('cAddrProofDocNo', e.target.value)}
                maxLength={30}
                placeholder={isOCI && form.cAddrProof === '161' ? 'Required for OCI when proof=161' : ''}
              />
              {errors.cAddrProofDocNo && <span className="error-text">{errors.cAddrProofDocNo}</span>}
            </label>

          </div>
        </div>

        {/* Permanent Address */}
        <div className="form-section">
          <h3>Permanent Address</h3>
          <div className="form-grid">
            <label className={`form-field ${errors.pAddrLine1 ? 'has-error' : ''}`}>
              <span className="form-label">Permanent Address Line 1 <span className="required">*</span></span>
              <input
                type="text"
                className="form-input"
                value={form.pAddrLine1}
                onChange={e => handleChange('pAddrLine1', e.target.value)}
                maxLength={60}
                placeholder="Flat/Building/Street"
              />
              {errors.pAddrLine1 && <span className="error-text">{errors.pAddrLine1}</span>}
            </label>

            <label className={`form-field ${errors.pAddrLine2 ? 'has-error' : ''}`}>
              <span className="form-label">Permanent Address Line 2</span>
              <input
                type="text"
                className="form-input"
                value={form.pAddrLine2}
                onChange={e => handleChange('pAddrLine2', e.target.value)}
                maxLength={60}
              />
              {errors.pAddrLine2 && <span className="error-text">{errors.pAddrLine2}</span>}
            </label>

            <label className={`form-field ${errors.pAddrLine3 ? 'has-error' : ''}`}>
              <span className="form-label">Permanent Address Line 3</span>
              <input
                type="text"
                className="form-input"
                value={form.pAddrLine3}
                onChange={e => handleChange('pAddrLine3', e.target.value)}
                maxLength={60}
              />
              {errors.pAddrLine3 && <span className="error-text">{errors.pAddrLine3}</span>}
            </label>

            <label className={`form-field ${errors.pAddrLine4 ? 'has-error' : ''}`}>
              <span className="form-label">Permanent Address Line 4</span>
              <input
                type="text"
                className="form-input"
                value={form.pAddrLine4}
                onChange={e => handleChange('pAddrLine4', e.target.value)}
                maxLength={60}
              />
              {errors.pAddrLine4 && <span className="error-text">{errors.pAddrLine4}</span>}
            </label>

            <label className={`form-field ${errors.pState ? 'has-error' : ''}`}>
              <span className="form-label">Permanent State <span className="required">*</span></span>
              <select className="form-input" value={form.pState} onChange={e => handleChange('pState', e.target.value)}>
                <option value="">Select</option>
                {renderStateOptions()}
              </select>
              {errors.pState && <span className="error-text">{errors.pState}</span>}
            </label>

            <label className={`form-field ${errors.pCountry ? 'has-error' : ''}`}>
              <span className="form-label">Permanent Country <span className="required">*</span></span>
              <select className="form-input" value={form.pCountry} onChange={e => handleChange('pCountry', e.target.value)}>
                <option value="">Select</option>
                {renderCountryOptions()}
              </select>
              {errors.pCountry && <span className="error-text">{errors.pCountry}</span>}
            </label>

            <label className={`form-field ${errors.pPincode ? 'has-error' : ''}`}>
              <span className="form-label">Permanent Pincode </span>
              <input
                type="text"
                className="form-input"
                value={form.pPincode}
                onChange={e => handleChange('pPincode', e.target.value)}
                maxLength={10}
                placeholder="6 digits numeric for RI/NRI; up to 10 alnum for OCI"
              />
              {errors.pPincode && <span className="error-text">{errors.pPincode}</span>}
            </label>

            <label className={`form-field ${errors.pAddrProof ? 'has-error' : ''}`}>
              <span className="form-label">Permanent Address Proof <span className="required">*</span></span>
              <select className="form-input" value={form.pAddrProof} onChange={e => handleChange('pAddrProof', e.target.value)}>
                <option value="">Select Proof</option>
                {renderPOAOptions()}
              </select>
              {errors.pAddrProof && <span className="error-text">{errors.pAddrProof}</span>}
            </label>

            <label className={`form-field ${errors.addrProofDocName ? 'has-error' : ''}`}>
              <span className="form-label">Address Proof Doc Name {form.pAddrProof === '333' && <span className="required">*</span>}</span>
              <input
                type="text"
                className="form-input"
                value={form.addrProofDocName}
                onChange={e => handleChange('addrProofDocName', e.target.value)}
                maxLength={30}
                placeholder={form.pAddrProof === '333' ? 'Required when code = 333' : ''}
              />
              {errors.addrProofDocName && <span className="error-text">{errors.addrProofDocName}</span>}
            </label>

            <label className={`form-field ${errors.foreignAddressStateForNRI ? 'has-error' : ''}`}>
              <span className="form-label">Foreign Address State For NRI {isOCI && <span className="required">*</span>}</span>
              <input
                type="text"
                className="form-input"
                value={form.foreignAddressStateForNRI}
                onChange={e => handleChange('foreignAddressStateForNRI', e.target.value)}
                maxLength={30}
                placeholder={isRI ? 'Filler for RI' : 'Free text for NRI/OCI (max 30)'}
              />
              {errors.foreignAddressStateForNRI && <span className="error-text">{errors.foreignAddressStateForNRI}</span>}
            </label>

          </div>
        </div>

        {/* Communication Preferences */}
        <div className="form-section">
          <h3>Communication Preferences</h3>
          <div className="form-grid">
            <label className={`form-field ${errors.smsSubFlag ? 'has-error' : ''}`}>
              <span className="form-label">SMS Subscription Flag</span>
              <select className="form-input" value={form.smsSubFlag} onChange={e => handleChange('smsSubFlag', e.target.value)}>
                <option value="Y">Y (default)</option>
                <option value="N">N</option>
              </select>
              {errors.smsSubFlag && <span className="error-text">{errors.smsSubFlag}</span>}
            </label>

            <label className={`form-field ${errors.emailSubFlag ? 'has-error' : ''}`}>
              <span className="form-label">Email Subscription Flag</span>
              <select className="form-input" value={form.emailSubFlag} onChange={e => handleChange('emailSubFlag', e.target.value)}>
                <option value="Y">Y (default)</option>
                <option value="N">N</option>
              </select>
              {errors.emailSubFlag && <span className="error-text">{errors.emailSubFlag}</span>}
            </label>

            <label className={`form-field ${errors.preferredAddressForCommunication ? 'has-error' : ''}`}>
              <span className="form-label">Preferred Address For Communication {(isNRI || isOCI) && <span className="required">*</span>}</span>
              <select className="form-input" value={form.preferredAddressForCommunication} onChange={e => handleChange('preferredAddressForCommunication', e.target.value)}>
                <option value="">Select</option>
                <option value="O">O - Overseas Address</option>
                <option value="I">I - Indian Address</option>
              </select>
              {errors.preferredAddressForCommunication && <span className="error-text">{errors.preferredAddressForCommunication}</span>}
            </label>

            <label className={`form-field ${errors.emailVerificationFlag ? 'has-error' : ''}`}>
              <span className="form-label">Email Verification Flag</span>
              <select className="form-input" value={form.emailVerificationFlag} onChange={e => handleChange('emailVerificationFlag', e.target.value)}>
                <option value="N">N</option>
                <option value="Y">Y</option>
              </select>
              {errors.emailVerificationFlag && <span className="error-text">{errors.emailVerificationFlag}</span>}
            </label>

            <label className={`form-field ${errors.mobileVerificationFlag ? 'has-error' : ''}`}>
              <span className="form-label">Mobile Verification Flag</span>
              <select className="form-input" value={form.mobileVerificationFlag} onChange={e => handleChange('mobileVerificationFlag', e.target.value)}>
                <option value="N">N</option>
                <option value="Y">Y</option>
              </select>
              {errors.mobileVerificationFlag && <span className="error-text">{errors.mobileVerificationFlag}</span>}
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="action-button secondary" onClick={handleBack}>Back</button>
          <button
            type="button"
            className={`action-button ${Object.keys(errors).length > 0 || !form.pAddrLine1 ? 'disabled' : 'primary'}`}
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
