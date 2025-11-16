import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PersonalDetails.css';

const PersonalDetails = () => {
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
    sotLangCode: ''
  });

  const [errors, setErrors] = useState({});

  // ---------- VALIDATION ----------
  const validateField = useCallback(
    (name, value) => {
      const newErr = { ...errors };
      delete newErr[name];

      // Personal Information
      if (name === 'title' && !value) newErr[name] = 'Title is required';
      if (name === 'firstName') {
        if (!value) newErr[name] = 'First Name is required';
        else if (value.length < 1 || value.length > 90) newErr[name] = 'First Name must be 1-90 characters';
      }
      if (name === 'middleName' && value.length > 30) newErr[name] = 'Middle Name must be 0-30 characters';
      if (name === 'lastName') {
        if (!value) newErr[name] = 'Last Name is required';
        else if (value.length < 1 || value.length > 30) newErr[name] = 'Last Name must be 1-30 characters';
      }
      if (name === 'dateOfBirth') {
        if (!value) newErr[name] = 'Date of Birth is required';
        else if (!/^\d{8}$/.test(value)) newErr[name] = 'Date must be in DDMMYYYY format';
      }
      if (name === 'gender' && !value) newErr[name] = 'Gender is required';
      if (name === 'orphan' && !value) newErr[name] = 'Orphan status is required';
      if (name === 'placeOfBirth') {
        if (!value) newErr[name] = 'Place of Birth is required';
        else if (value.length < 1 || value.length > 30) newErr[name] = 'Place of Birth must be 1-30 characters';
      }
      if (name === 'countryOfBirth' && !value) newErr[name] = 'Country of Birth is required';
      if (name === 'maritalStatus' && !value) newErr[name] = 'Marital Status is required';
      if (name === 'mobile') {
        if (!value) newErr[name] = 'Mobile is required';
        else if (!/^\d+$/.test(value)) newErr[name] = 'Mobile must contain only digits';
        else if (value.length < 7 || value.length > 14) newErr[name] = 'Mobile must be 7-14 digits';
      }
      if (name === 'email') {
        if (!value) newErr[name] = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErr[name] = 'Invalid email format';
        else if (value.length > 80) newErr[name] = 'Email must be less than 80 characters';
      }
      if (name === 'telephone' && value && (!/^\d+$/.test(value) || value.length > 15)) {
        newErr[name] = 'Telephone must contain only digits and be less than 15 characters';
      }

      // Family Details
      if (name === 'passportNumber' && value && value.length !== 8) newErr[name] = 'Passport Number must be 8 characters';
      if (name === 'voterId' && value && (value.length < 10 || value.length > 12)) newErr[name] = 'Voter ID must be 10-12 characters';
      if (name === 'cersaiId' && value && (value.length < 1 || value.length > 15)) newErr[name] = 'Cersai ID must be 1-15 characters';
      if (name === 'retirementAdvId' && value && (value.length < 1 || value.length > 12)) newErr[name] = 'Retirement Adv ID must be 1-12 characters';

      // Documents
      if (name === 'idProofNumber' && value && (value.length < 1 || value.length > 30)) newErr[name] = 'ID Proof Number must be 1-30 characters';
      if (name === 'idProofOthers' && value && (value.length < 1 || value.length > 30)) newErr[name] = 'ID Proof Others must be 1-30 characters';
      if (name === 'dobProof' && !value) newErr[name] = 'DOB Proof is required';
      if (name === 'dobProofDocNum' && value && (value.length < 1 || value.length > 30)) newErr[name] = 'DOB Proof Doc Number must be 1-30 characters';
      if (name === 'last4Aadhaar' && value && !/^\d{4} \d{4} \d{4} \d{4}$/.test(value)) newErr[name] = 'Last 4 Aadhaar must be XXXX XXXX XXXX 1234';
      if (name === 'form60' && value && value.length > 1) newErr[name] = 'Form 60 must be 1 character';
      if (name === 'form60f' && value && value.length > 9) newErr[name] = 'Form 60F must be less than 9 characters';
      if (name === 'ePranWelcomePlan' && !value) newErr[name] = 'E-Pran Welcome Plan is required';
      if (name === 'modeOfRegistration' && !value) newErr[name] = 'Mode of Registration is required';
      if (name === 'npsOnBoarding' && !value) newErr[name] = 'NPS On Boarding is required';
      if (name === 'foreignPassportNumber' && value && (value.length < 8 || value.length > 9)) newErr[name] = 'Foreign Passport Number must be 8-9 characters';
      if (name === 'visaPermitNo' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'Visa Permit No must be 1-20 characters';
      if (name === 'productType' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'Product Type must be 1-20 characters';
      if (name === 'productTypeOther' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'Product Type Other must be 1-20 characters';
      if (name === 'hindiSubFlag' && !value) newErr[name] = 'Hindi Sub Flag is required';
      if (name === 'subscriberDeclaration' && !value) newErr[name] = 'Subscriber Declaration is required';
      if (name === 'employerDeclaration' && !value) newErr[name] = 'Employer Declaration is required';
      if (name === 'existingCustomerPop' && !value) newErr[name] = 'Existing Customer Pop is required';

      // KYC & PAN
      if (name === 'kycVerificationFlag') {
        if (!value) newErr[name] = 'KYC Verification Flag is required';
        else if (value.length < 1 || value.length > 20) newErr[name] = 'KYC Verification Flag must be 1-20 characters';
      }
      if (name === 'panVerificationFlag' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'PAN Verification Flag must be 1-20 characters';
      if (name === 'firstNameHindi' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'First Name Hindi must be 1-20 characters';
      if (name === 'lastNameHindi' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'Last Name Hindi must be 1-20 characters';
      if (name === 'middleNameHindi' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'Middle Name Hindi must be 1-20 characters';
      if (name === 'guardianFirstName' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'Guardian First Name must be 1-20 characters';
      if (name === 'guardianMiddleName' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'Guardian Middle Name must be 1-20 characters';
      if (name === 'guardianLastName' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'Guardian Last Name must be 1-20 characters';
      if (name === 'idProofExpiryDate' && value && !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) newErr[name] = 'ID Proof Expiry Date must be DD/MM/YYYY';
      if (name === 'kycMode' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'KYC Mode must be 1-20 characters';
      if (name === 'choRegNo' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'CHO Reg No must be 1-20 characters';
      if (name === 'cboRegNo' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'CBO Reg No must be 1-20 characters';
      if (name === 'popRegNo' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'POP Reg No must be 1-20 characters';
      if (name === 'popSpRegNoDeclaration' && value && (value.length < 1 || value.length > 20)) newErr[name] = 'POP SP Reg No Declaration must be 1-20 characters';
      if (name === 'sotLangCode' && value && (!/^\d{2}$/.test(value) || parseInt(value) < 0 || parseInt(value) > 10)) {
        newErr[name] = 'SOT Lang Code must be 2 digits between 00-10';
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
    const mandatory = [
      'title', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'orphan',
      'placeOfBirth', 'countryOfBirth', 'maritalStatus', 'mobile', 'email',
      'dobProof', 'ePranWelcomePlan', 'modeOfRegistration', 'npsOnBoarding',
      'hindiSubFlag', 'subscriberDeclaration', 'employerDeclaration',
      'existingCustomerPop', 'kycVerificationFlag'
    ];

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
    subTitle: form.title,
    subFstName: form.firstName,
    subMdlName: form.middleName,
    subLastName: form.lastName,
    gender: form.gender,
    subDob: form.dateOfBirth,
    placeOfBirth: form.placeOfBirth,
    countryOfBirth: form.countryOfBirth,
    maritalStatus: form.maritalStatus,
    mobile: form.mobile,
    email: form.email,
    telRes: form.telephone,
    fthFirstName: form.fatherFirstName,
    fthMiddleName: form.fatherMiddleName,
    fthLastName: form.fatherLastName,
    mthFirstName: form.motherFirstName,
    mthMiddleName: form.motherMiddleName,
    mthLastName: form.motherLastName,
    spouseFirstName: form.spouseFirstName,
    spouseMiddleName: form.spouseMiddleName,
    spouseLastName: form.spouseLastName,
    pan: form.idProofNumber,
    passport: form.passportNumber,
    voterId: form.voterId,
    cersaiId: form.cersaiId,
    retirementAdvId: form.retirementAdvId,
    idProof: form.idProof,
    idProofNumber: form.idProofNumber,
    idProofOthers: form.idProofOthers,
    dobProof: form.dobProof,
    dobProofDocNum: form.dobProofDocNum,
    last4DigitsOfAadhaar: form.last4Aadhaar,
    form60Flag: form.form60,
    form60FinYr: form.form60f,
    epranWelcomePran: form.ePranWelcomePlan,
    modeOfRegistration: form.modeOfRegistration,
    npsOnBoarding: form.npsOnBoarding,
    orphan: form.orphan,
    foreignPassportNumber: form.foreignPassportNumber,
    visaPermitNo: form.visaPermitNo,
    productType: form.productType,
    producTypeOther: form.productTypeOther,
    hindiSubFlag: form.hindiSubFlag,
    subscriberDeclaration: form.subscriberDeclaration,
    employerDeclaration: form.employerDeclaration,
    existingCustomerCustomePop: form.existingCustomerPop,
    kycVerificationFlag: form.kycVerificationFlag,
    panVerificationFlag: form.panVerificationFlag,
    fistNameHindi: form.firstNameHindi,
    lastNameHindi: form.lastNameHindi,
    middleNameHindi: form.middleNameHindi,
    guardianFistNameHindi: form.guardianFirstName,
    guardianLastNameHindi: form.guardianLastName,
    guardianMiddleNameHindi: form.guardianMiddleName,
    idProofExpiryDate: form.idProofExpiryDate,
    kycMode: form.kycMode,
    choRegNoInEmployeeDeclarationSection: form.choRegNo,
    cboRegNoInEmployeeDeclarationSection: form.cboRegNo,
    popRegNoInDeclaration: form.popRegNo,
    popSpRegNoInEmployeeDeclarationSection: form.popSpRegNoDeclaration,
    sotLangCode: form.sotLangCode,
    modeOfAnnualSot: form.modeOfAnnualSot
  });

  // ---------- BUTTON HANDLERS ----------
  const handleNext = () => {
    if (validateAll()) {
      const payload = getOutputJSON();
      localStorage.setItem('personalDetails', JSON.stringify(payload));
      navigate('/registration/contact');
    }
  };

  const handleBack = () => {
    navigate('/registration/initial');
  };

  // ---------- RENDER ----------
  return (
    <div className="app-main">
      <section className="form-card">
        <h2>Personal Details</h2>

        {/* Personal Information */}
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <label className={`form-field${errors.title ? ' has-error' : ''}`}>
              <span className="form-label">
                Title <span className="required">*</span>
              </span>
              <select className="form-input" value={form.title} onChange={(e) => handleChange('title', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="SHRI">SHRI</option>
                <option value="SMT">SMT</option>
                <option value="KUMARI">KUMARI</option>
              </select>
              {errors.title && <span className="error-text">{errors.title}</span>}
            </label>

            <label className={`form-field${errors.firstName ? ' has-error' : ''}`}>
              <span className="form-label">
                First Name <span className="required">*</span>
              </span>
              <input type="text" className="form-input" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </label>

            <label className={`form-field${errors.middleName ? ' has-error' : ''}`}>
              <span className="form-label">Middle Name</span>
              <input type="text" className="form-input" value={form.middleName} onChange={(e) => handleChange('middleName', e.target.value)} />
              {errors.middleName && <span className="error-text">{errors.middleName}</span>}
            </label>

            <label className={`form-field${errors.lastName ? ' has-error' : ''}`}>
              <span className="form-label">
                Last Name <span className="required">*</span>
              </span>
              <input type="text" className="form-input" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </label>

            <label className={`form-field${errors.dateOfBirth ? ' has-error' : ''}`}>
              <span className="form-label">
                Date of Birth <span className="required">*</span>
              </span>
              <input
                type="text"
                className="form-input"
                placeholder="DDMMYYYY"
                value={form.dateOfBirth}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                  handleChange('dateOfBirth', v);
                }}
              />
              {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
            </label>

            <label className={`form-field${errors.gender ? ' has-error' : ''}`}>
              <span className="form-label">
                Gender <span className="required">*</span>
              </span>
              <select className="form-input" value={form.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </label>

            <label className={`form-field${errors.orphan ? ' has-error' : ''}`}>
              <span className="form-label">
                Orphan <span className="required">*</span>
              </span>
              <select className="form-input" value={form.orphan} onChange={(e) => handleChange('orphan', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.orphan && <span className="error-text">{errors.orphan}</span>}
            </label>

            <label className={`form-field${errors.placeOfBirth ? ' has-error' : ''}`}>
              <span className="form-label">
                Place of Birth <span className="required">*</span>
              </span>
              <input type="text" className="form-input" value={form.placeOfBirth} onChange={(e) => handleChange('placeOfBirth', e.target.value)} />
              {errors.placeOfBirth && <span className="error-text">{errors.placeOfBirth}</span>}
            </label>

            <label className={`form-field${errors.countryOfBirth ? ' has-error' : ''}`}>
              <span className="form-label">
                Country of Birth <span className="required">*</span>
              </span>
              <select className="form-input" value={form.countryOfBirth} onChange={(e) => handleChange('countryOfBirth', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="IND">IND</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Other">Other</option>
              </select>
              {errors.countryOfBirth && <span className="error-text">{errors.countryOfBirth}</span>}
            </label>

            <label className={`form-field${errors.maritalStatus ? ' has-error' : ''}`}>
              <span className="form-label">
                Marital Status <span className="required">*</span>
              </span>
              <select className="form-input" value={form.maritalStatus} onChange={(e) => handleChange('maritalStatus', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
              {errors.maritalStatus && <span className="error-text">{errors.maritalStatus}</span>}
            </label>

            <label className={`form-field${errors.mobile ? ' has-error' : ''}`}>
              <span className="form-label">
                Mobile <span className="required">*</span>
              </span>
              <input
                type="tel"
                className="form-input"
                value={form.mobile}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  handleChange('mobile', v);
                }}
              />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </label>

            <label className={`form-field${errors.email ? ' has-error' : ''}`}>
              <span className="form-label">
                Email <span className="required">*</span>
              </span>
              <input type="email" className="form-input" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </label>

            <label className={`form-field${errors.telephone ? ' has-error' : ''}`}>
              <span className="form-label">Telephone</span>
              <input
                type="tel"
                className="form-input"
                value={form.telephone}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  handleChange('telephone', v);
                }}
              />
              {errors.telephone && <span className="error-text">{errors.telephone}</span>}
            </label>
          </div>
        </div>

        {/* Family Details */}
        <div className="form-section">
          <h3>Family Details</h3>
          <div className="form-grid">
            <label className="form-field">
              <span className="form-label">Father's First Name</span>
              <input type="text" className="form-input" value={form.fatherFirstName} onChange={(e) => handleChange('fatherFirstName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Father's Middle Name</span>
              <input type="text" className="form-input" value={form.fatherMiddleName} onChange={(e) => handleChange('fatherMiddleName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Father's Last Name</span>
              <input type="text" className="form-input" value={form.fatherLastName} onChange={(e) => handleChange('fatherLastName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Mother's First Name</span>
              <input type="text" className="form-input" value={form.motherFirstName} onChange={(e) => handleChange('motherFirstName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Mother's Middle Name</span>
              <input type="text" className="form-input" value={form.motherMiddleName} onChange={(e) => handleChange('motherMiddleName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Mother's Last Name</span>
              <input type="text" className="form-input" value={form.motherLastName} onChange={(e) => handleChange('motherLastName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Spouse First Name</span>
              <input type="text" className="form-input" value={form.spouseFirstName} onChange={(e) => handleChange('spouseFirstName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Spouse Middle Name</span>
              <input type="text" className="form-input" value={form.spouseMiddleName} onChange={(e) => handleChange('spouseMiddleName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Spouse Last Name</span>
              <input type="text" className="form-input" value={form.spouseLastName} onChange={(e) => handleChange('spouseLastName', e.target.value)} />
            </label>

            <label className={`form-field${errors.passportNumber ? ' has-error' : ''}`}>
              <span className="form-label">Passport Number</span>
              <input type="text" className="form-input" value={form.passportNumber} onChange={(e) => handleChange('passportNumber', e.target.value)} />
              {errors.passportNumber && <span className="error-text">{errors.passportNumber}</span>}
            </label>

            <label className={`form-field${errors.voterId ? ' has-error' : ''}`}>
              <span className="form-label">Voter Id</span>
              <input type="text" className="form-input" value={form.voterId} onChange={(e) => handleChange('voterId', e.target.value)} />
              {errors.voterId && <span className="error-text">{errors.voterId}</span>}
            </label>

            <label className={`form-field${errors.cersaiId ? ' has-error' : ''}`}>
              <span className="form-label">Cersai Id</span>
              <input type="text" className="form-input" value={form.cersaiId} onChange={(e) => handleChange('cersaiId', e.target.value)} />
              {errors.cersaiId && <span className="error-text">{errors.cersaiId}</span>}
            </label>

            <label className={`form-field${errors.retirementAdvId ? ' has-error' : ''}`}>
              <span className="form-label">Retirement Adv ID</span>
              <input type="text" className="form-input" value={form.retirementAdvId} onChange={(e) => handleChange('retirementAdvId', e.target.value)} />
              {errors.retirementAdvId && <span className="error-text">{errors.retirementAdvId}</span>}
            </label>
          </div>
        </div>

        {/* Documents */}
        <div className="form-section">
          <h3>Documents</h3>
          <div className="form-grid">
            <label className="form-field">
              <span className="form-label">ID Proof</span>
              <select className="form-input" value={form.idProof} onChange={(e) => handleChange('idProof', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Passport">Passport</option>
                <option value="Pan Card">Pan Card</option>
                <option value="Driving License">Driving License</option>
              </select>
            </label>

            <label className={`form-field${errors.idProofNumber ? ' has-error' : ''}`}>
              <span className="form-label">ID Proof Number</span>
              <input type="text" className="form-input" value={form.idProofNumber} onChange={(e) => handleChange('idProofNumber', e.target.value)} />
              {errors.idProofNumber && <span className="error-text">{errors.idProofNumber}</span>}
            </label>

            <label className={`form-field${errors.idProofOthers ? ' has-error' : ''}`}>
              <span className="form-label">ID Proof Others</span>
              <input type="text" className="form-input" value={form.idProofOthers} onChange={(e) => handleChange('idProofOthers', e.target.value)} />
              {errors.idProofOthers && <span className="error-text">{errors.idProofOthers}</span>}
            </label>

            <label className={`form-field${errors.dobProof ? ' has-error' : ''}`}>
              <span className="form-label">
                DOB Proof <span className="required">*</span>
              </span>
              <select className="form-input" value={form.dobProof} onChange={(e) => handleChange('dobProof', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Passport">Passport</option>
                <option value="Other">Other</option>
              </select>
              {errors.dobProof && <span className="error-text">{errors.dobProof}</span>}
            </label>

            <label className={`form-field${errors.dobProofDocNum ? ' has-error' : ''}`}>
              <span className="form-label">DOB Proof Doc Number</span>
              <input type="text" className="form-input" value={form.dobProofDocNum} onChange={(e) => handleChange('dobProofDocNum', e.target.value)} />
              {errors.dobProofDocNum && <span className="error-text">{errors.dobProofDocNum}</span>}
            </label>

            <label className={`form-field${errors.last4Aadhaar ? ' has-error' : ''}`}>
              <span className="form-label">Last 4 Digits Of Aadhaar</span>
              <input
                type="text"
                className="form-input"
                placeholder="XXXX XXXX XXXX 1234"
                value={form.last4Aadhaar}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '');
                  if (v.length > 4) v = v.slice(0, 4) + ' ' + v.slice(4);
                  if (v.length > 9) v = v.slice(0, 9) + ' ' + v.slice(9);
                  if (v.length > 14) v = v.slice(0, 14) + ' ' + v.slice(14, 18);
                  handleChange('last4Aadhaar', v);
                }}
              />
              {errors.last4Aadhaar && <span className="error-text">{errors.last4Aadhaar}</span>}
            </label>

            <label className={`form-field${errors.form60 ? ' has-error' : ''}`}>
              <span className="form-label">Form 60</span>
              <input type="text" className="form-input" value={form.form60} onChange={(e) => handleChange('form60', e.target.value)} />
              {errors.form60 && <span className="error-text">{errors.form60}</span>}
            </label>

            <label className={`form-field${errors.form60f ? ' has-error' : ''}`}>
              <span className="form-label">Form 60F in Year</span>
              <input type="text" className="form-input" value={form.form60f} onChange={(e) => handleChange('form60f', e.target.value)} />
              {errors.form60f && <span className="error-text">{errors.form60f}</span>}
            </label>

            <label className={`form-field${errors.ePranWelcomePlan ? ' has-error' : ''}`}>
              <span className="form-label">
                E-Pran Welcome Plan <span className="required">*</span>
              </span>
              <select className="form-input" value={form.ePranWelcomePlan} onChange={(e) => handleChange('ePranWelcomePlan', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Physical + Email">Physical + Email</option>
                <option value="Physical">Physical</option>
                <option value="Email">Email</option>
              </select>
              {errors.ePranWelcomePlan && <span className="error-text">{errors.ePranWelcomePlan}</span>}
            </label>

            <label className={`form-field${errors.modeOfRegistration ? ' has-error' : ''}`}>
              <span className="form-label">
                Mode Of Registration <span className="required">*</span>
              </span>
              <select className="form-input" value={form.modeOfRegistration} onChange={(e) => handleChange('modeOfRegistration', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="API">API</option>
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>
              {errors.modeOfRegistration && <span className="error-text">{errors.modeOfRegistration}</span>}
            </label>

            <label className={`form-field${errors.npsOnBoarding ? ' has-error' : ''}`}>
              <span className="form-label">
                NPS On Boarding <span className="required">*</span>
              </span>
              <select className="form-input" value={form.npsOnBoarding} onChange={(e) => handleChange('npsOnBoarding', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="P">P</option>
                <option value="E">E</option>
                <option value="O">O</option>
                <option value="F">F</option>
              </select>
              {errors.npsOnBoarding && <span className="error-text">{errors.npsOnBoarding}</span>}
            </label>

            <label className={`form-field${errors.foreignPassportNumber ? ' has-error' : ''}`}>
              <span className="form-label">Foreign Passport Number</span>
              <input type="text" className="form-input" value={form.foreignPassportNumber} onChange={(e) => handleChange('foreignPassportNumber', e.target.value)} />
              {errors.foreignPassportNumber && <span className="error-text">{errors.foreignPassportNumber}</span>}
            </label>

            <label className={`form-field${errors.visaPermitNo ? ' has-error' : ''}`}>
              <span className="form-label">Visa Permit No</span>
              <input type="text" className="form-input" value={form.visaPermitNo} onChange={(e) => handleChange('visaPermitNo', e.target.value)} />
              {errors.visaPermitNo && <span className="error-text">{errors.visaPermitNo}</span>}
            </label>

            <label className={`form-field${errors.productType ? ' has-error' : ''}`}>
              <span className="form-label">Product Type</span>
              <input type="text" className="form-input" value={form.productType} onChange={(e) => handleChange('productType', e.target.value)} />
              {errors.productType && <span className="error-text">{errors.productType}</span>}
            </label>

            <label className={`form-field${errors.productTypeOther ? ' has-error' : ''}`}>
              <span className="form-label">Product Type Other</span>
              <input type="text" className="form-input" value={form.productTypeOther} onChange={(e) => handleChange('productTypeOther', e.target.value)} />
              {errors.productTypeOther && <span className="error-text">{errors.productTypeOther}</span>}
            </label>

            <label className={`form-field${errors.hindiSubFlag ? ' has-error' : ''}`}>
              <span className="form-label">
                Hindi Sub Flag <span className="required">*</span>
              </span>
              <select className="form-input" value={form.hindiSubFlag} onChange={(e) => handleChange('hindiSubFlag', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
              {errors.hindiSubFlag && <span className="error-text">{errors.hindiSubFlag}</span>}
            </label>

            <label className={`form-field${errors.subscriberDeclaration ? ' has-error' : ''}`}>
              <span className="form-label">
                Subscriber Declaration <span className="required">*</span>
              </span>
              <select className="form-input" value={form.subscriberDeclaration} onChange={(e) => handleChange('subscriberDeclaration', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
              {errors.subscriberDeclaration && <span className="error-text">{errors.subscriberDeclaration}</span>}
            </label>

            <label className={`form-field${errors.employerDeclaration ? ' has-error' : ''}`}>
              <span className="form-label">
                Employer Declaration <span className="required">*</span>
              </span>
              <select className="form-input" value={form.employerDeclaration} onChange={(e) => handleChange('employerDeclaration', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
              {errors.employerDeclaration && <span className="error-text">{errors.employerDeclaration}</span>}
            </label>

            <label className={`form-field${errors.existingCustomerPop ? ' has-error' : ''}`}>
              <span className="form-label">
                Existing Customer Pop <span className="required">*</span>
              </span>
              <select className="form-input" value={form.existingCustomerPop} onChange={(e) => handleChange('existingCustomerPop', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
                <option value="B?">B?</option>
              </select>
              {errors.existingCustomerPop && <span className="error-text">{errors.existingCustomerPop}</span>}
            </label>
          </div>
        </div>

        {/* KYC & PAN */}
        <div className="form-section">
          <h3>KYC & PAN Verification</h3>
          <div className="form-grid">
            <label className={`form-field${errors.kycVerificationFlag ? ' has-error' : ''}`}>
              <span className="form-label">
                KYC Verification Flag <span className="required">*</span>
              </span>
              <input type="text" className="form-input" value={form.kycVerificationFlag} onChange={(e) => handleChange('kycVerificationFlag', e.target.value)} />
              {errors.kycVerificationFlag && <span className="error-text">{errors.kycVerificationFlag}</span>}
            </label>

            <label className={`form-field${errors.panVerificationFlag ? ' has-error' : ''}`}>
              <span className="form-label">PAN Verification Flag</span>
              <input type="text" className="form-input" value={form.panVerificationFlag} onChange={(e) => handleChange('panVerificationFlag', e.target.value)} />
              {errors.panVerificationFlag && <span className="error-text">{errors.panVerificationFlag}</span>}
            </label>

            <label className={`form-field${errors.firstNameHindi ? ' has-error' : ''}`}>
              <span className="form-label">First Name Hindi</span>
              <input type="text" className="form-input" value={form.firstNameHindi} onChange={(e) => handleChange('firstNameHindi', e.target.value)} />
              {errors.firstNameHindi && <span className="error-text">{errors.firstNameHindi}</span>}
            </label>

            <label className={`form-field${errors.lastNameHindi ? ' has-error' : ''}`}>
              <span className="form-label">Last Name Hindi</span>
              <input type="text" className="form-input" value={form.lastNameHindi} onChange={(e) => handleChange('lastNameHindi', e.target.value)} />
              {errors.lastNameHindi && <span className="error-text">{errors.lastNameHindi}</span>}
            </label>

            <label className={`form-field${errors.middleNameHindi ? ' has-error' : ''}`}>
              <span className="form-label">Middle Name Hindi</span>
              <input type="text" className="form-input" value={form.middleNameHindi} onChange={(e) => handleChange('middleNameHindi', e.target.value)} />
              {errors.middleNameHindi && <span className="error-text">{errors.middleNameHindi}</span>}
            </label>

            <label className={`form-field${errors.guardianFirstName ? ' has-error' : ''}`}>
              <span className="form-label">Guardian First Name</span>
              <input type="text" className="form-input" value={form.guardianFirstName} onChange={(e) => handleChange('guardianFirstName', e.target.value)} />
              {errors.guardianFirstName && <span className="error-text">{errors.guardianFirstName}</span>}
            </label>

            <label className={`form-field${errors.guardianMiddleName ? ' has-error' : ''}`}>
              <span className="form-label">Guardian Middle Name</span>
              <input type="text" className="form-input" value={form.guardianMiddleName} onChange={(e) => handleChange('guardianMiddleName', e.target.value)} />
              {errors.guardianMiddleName && <span className="error-text">{errors.guardianMiddleName}</span>}
            </label>

            <label className={`form-field${errors.guardianLastName ? ' has-error' : ''}`}>
              <span className="form-label">Guardian Last Name</span>
              <input type="text" className="form-input" value={form.guardianLastName} onChange={(e) => handleChange('guardianLastName', e.target.value)} />
              {errors.guardianLastName && <span className="error-text">{errors.guardianLastName}</span>}
            </label>

            <label className={`form-field${errors.idProofExpiryDate ? ' has-error' : ''}`}>
              <span className="form-label">ID Proof Expiry Date</span>
              <input
                type="text"
                className="form-input"
                placeholder="DD/MM/YYYY"
                value={form.idProofExpiryDate}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '');
                  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                  if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5, 9);
                  handleChange('idProofExpiryDate', v);
                }}
              />
              {errors.idProofExpiryDate && <span className="error-text">{errors.idProofExpiryDate}</span>}
            </label>

            <label className={`form-field${errors.kycMode ? ' has-error' : ''}`}>
              <span className="form-label">KYC Mode</span>
              <input type="text" className="form-input" value={form.kycMode} onChange={(e) => handleChange('kycMode', e.target.value)} />
              {errors.kycMode && <span className="error-text">{errors.kycMode}</span>}
            </label>

            <label className={`form-field${errors.choRegNo ? ' has-error' : ''}`}>
              <span className="form-label">CHO Reg No</span>
              <input type="text" className="form-input" value={form.choRegNo} onChange={(e) => handleChange('choRegNo', e.target.value)} />
              {errors.choRegNo && <span className="error-text">{errors.choRegNo}</span>}
            </label>
          </div>
        </div>

        {/* Declaration References */}
        <div className="form-section">
          <h3>Declaration References</h3>
          <div className="form-grid">
            <label className={`form-field${errors.cboRegNo ? ' has-error' : ''}`}>
              <span className="form-label">CBO Reg No</span>
              <input type="text" className="form-input" value={form.cboRegNo} onChange={(e) => handleChange('cboRegNo', e.target.value)} />
              {errors.cboRegNo && <span className="error-text">{errors.cboRegNo}</span>}
            </label>

            <label className={`form-field${errors.popRegNo ? ' has-error' : ''}`}>
              <span className="form-label">POP Reg No</span>
              <input type="text" className="form-input" value={form.popRegNo} onChange={(e) => handleChange('popRegNo', e.target.value)} />
              {errors.popRegNo && <span className="error-text">{errors.popRegNo}</span>}
            </label>

            <label className={`form-field${errors.popSpRegNoDeclaration ? ' has-error' : ''}`}>
              <span className="form-label">POP SP Reg No Declaration</span>
              <input type="text" className="form-input" value={form.popSpRegNoDeclaration} onChange={(e) => handleChange('popSpRegNoDeclaration', e.target.value)} />
              {errors.popSpRegNoDeclaration && <span className="error-text">{errors.popSpRegNoDeclaration}</span>}
            </label>

            <label className="form-field">
              <span className="form-label">Mode Of Annual SOT</span>
              <select className="form-input" value={form.modeOfAnnualSot} onChange={(e) => handleChange('modeOfAnnualSot', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Physical">Physical</option>
                <option value="Email">Email</option>
              </select>
            </label>

            <label className={`form-field${errors.sotLangCode ? ' has-error' : ''}`}>
              <span className="form-label">SOT Lang Code</span>
              <input
                type="text"
                className="form-input"
                placeholder="00-10"
                value={form.sotLangCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  handleChange('sotLangCode', v);
                }}
              />
              {errors.sotLangCode && <span className="error-text">{errors.sotLangCode}</span>}
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
            className={`action-button${Object.keys(errors).length > 0 || !form.title ? ' disabled' : ' primary'}`}
            onClick={handleNext}
            disabled={Object.keys(errors).length > 0}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default PersonalDetails;