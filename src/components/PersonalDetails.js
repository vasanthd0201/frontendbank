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
    dateOfBirth: '', // Store in YYYY-MM-DD format for date picker
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
    pan: '',
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
    displayNameFlag: '',
    usPerson: '',
    existingCustomerFlag: '',
    citizenFlag: '',
    combinedFormFlag: ''
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
        else if (!/^[A-Za-z']/.test(value)) newErr[name] = 'First character must be alphabet or apostrophe';
        else if (!/^[A-Za-z'][A-Za-z\s()~!@#$%-/\\,.&*()_+-={}\[\]|?;:]*$/.test(value)) {
          newErr[name] = 'Second character onwards can only contain alphabets, spaces and special characters ()~!@#$%-/\\,.&*()_+-={}[|?;:]';
        }
      }
      if (name === 'middleName' && value.length > 30) newErr[name] = 'Middle Name must be 0-30 characters';
      if (name === 'lastName') {
        if (!value) newErr[name] = 'Last Name is required';
        else if (value.length < 1 || value.length > 30) newErr[name] = 'Last Name must be 1-30 characters';
        else if (!/^[A-Za-z']/.test(value)) newErr[name] = 'First character must be alphabet or apostrophe';
        else if (!/^[A-Za-z'][A-Za-z\s()~!@#$%-/\\,.&*()_+-={}\[\]|?;:]*$/.test(value)) {
          newErr[name] = 'Second character onwards can only contain alphabets, spaces and special characters ()~!@#$%-/\\,.&*()_+-={}[|?;:]';
        }
      }
      if (name === 'dateOfBirth') {
        if (!value) newErr[name] = 'Date of Birth is required';
        else {
          // Check if it's a valid date and not future date
          const dob = new Date(value);
          const today = new Date();
          
          if (isNaN(dob.getTime())) newErr[name] = 'Invalid date';
          else if (dob > today) newErr[name] = 'Date of Birth cannot be a future date';
          else {
            const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
            if (age < 18) newErr[name] = 'Subscriber age should be greater than or equal to 18 years';
          }
        }
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
        else if (!/^\+?\d+$/.test(value)) newErr[name] = 'Mobile must contain only digits and optionally start with +';
        else if (value.length < 7 || value.length > 14) newErr[name] = 'Mobile must be 7-14 digits';
        else if (value.startsWith('+91') && value.length === 13) newErr[name] = 'Mobile number starting with +91 cannot be 13 digits';
        else if (value.length === 10 && value.startsWith('0')) newErr[name] = '10-digit mobile number cannot start with 0';
      }
      if (name === 'email') {
        if (!value) newErr[name] = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErr[name] = 'Invalid email format';
        else if (value.length > 80) newErr[name] = 'Email must be less than 80 characters';
      }
      if (name === 'telephone' && value && (!/^\+?\d+$/.test(value) || value.length > 15)) {
        newErr[name] = 'Telephone must contain only digits and optionally start with +';
      }

      // Family Details
      if (name === 'fatherFirstName') {
        if (form.orphan === 'Y' && value) newErr[name] = 'Father\'s name should be blank if subscriber is an orphan';
        else if (form.orphan !== 'Y' && !form.motherFirstName && !value) newErr[name] = 'Either Father\'s or Mother\'s name is required';
        else if (value && !/^[A-Za-z']/.test(value)) newErr[name] = 'First character must be alphabet or apostrophe';
      }
      if (name === 'motherFirstName') {
        if (form.orphan === 'Y' && value) newErr[name] = 'Mother\'s name should be blank if subscriber is an orphan';
        else if (form.orphan !== 'Y' && !form.fatherFirstName && !value) newErr[name] = 'Either Father\'s or Mother\'s name is required';
        else if (value && !/^[A-Za-z']/.test(value)) newErr[name] = 'First character must be alphabet or apostrophe';
      }
      if (name === 'spouseFirstName' && form.maritalStatus === 'M' && !value) {
        newErr[name] = 'Spouse First Name is required if married';
      }
      if (name === 'pan') {
        if (form.combinedFormFlag === 'Y' && !value) newErr[name] = 'PAN is mandatory for combined registration';
        else if (form.usPerson === 'Y' && !value) newErr[name] = 'PAN is mandatory for US persons';
        else if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) newErr[name] = 'Invalid PAN format';
        else if (value && value.charAt(3) !== 'P') newErr[name] = '4th character of PAN must be P';
      }
      if (name === 'passportNumber' && value && value.length !== 8) {
        newErr[name] = 'Passport Number must be 8 characters';
      }
      if (name === 'voterId' && value && (value.length < 10 || value.length > 12)) {
        newErr[name] = 'Voter ID must be 10-12 characters';
      }
      if (name === 'cersaiId' && value && (!/^[A-Za-z0-9]+$/.test(value) || value.length > 15)) {
        newErr[name] = 'Cersai ID must be alphanumeric and max 15 characters';
      }
      if (name === 'retirementAdvId' && value && (!/^[A-Za-z0-9]+$/.test(value) || value.length > 12)) {
        newErr[name] = 'Retirement Adv ID must be alphanumeric and max 12 characters';
      }

      // Documents
      if (name === 'idProof' && form.existingCustomerFlag === 'N' && !value) {
        newErr[name] = 'ID Proof is required when not an existing customer';
      }
      if (name === 'idProofNumber' && value && (value.length < 1 || value.length > 30)) {
        newErr[name] = 'ID Proof Number must be 1-30 characters';
      }
      if (name === 'idProofOthers' && value && (value.length < 1 || value.length > 30)) {
        newErr[name] = 'ID Proof Others must be 1-30 characters';
      }
      if (name === 'dobProof' && !value) newErr[name] = 'DOB Proof is required';
      if (name === 'dobProofDocNum' && value && (value.length < 1 || value.length > 30)) {
        newErr[name] = 'DOB Proof Doc Number must be 1-30 characters';
      }
      if (name === 'last4Aadhaar' && value && !/^\d{4}$/.test(value)) {
        newErr[name] = 'Last 4 Aadhaar must be exactly 4 digits';
      }
      if (name === 'form60' && !value) newErr[name] = 'Form 60 flag is required';
      if (name === 'form60f' && form.form60 === 'Y' && !value) {
        newErr[name] = 'Form 60 Financial Year is required when Form 60 is selected';
      }
      if (name === 'ePranWelcomePlan' && !value) newErr[name] = 'E-Pran Welcome Plan is required';
      if (name === 'modeOfRegistration' && !value) newErr[name] = 'Mode of Registration is required';
      if (name === 'npsOnBoarding' && !value) newErr[name] = 'NPS On Boarding is required';
      if (name === 'foreignPassportNumber' && value && (value.length < 8 || value.length > 15)) {
        newErr[name] = 'Foreign Passport Number must be 8-15 characters';
      }
      if (name === 'visaPermitNo' && value && (value.length < 1 || value.length > 16)) {
        newErr[name] = 'Visa Permit No must be 1-16 characters';
      }
      if (name === 'productType' && form.existingCustomerFlag === 'O' && !value) {
        newErr[name] = 'Product Type is required for non-bank POP existing customers';
      }
      if (name === 'productTypeOther' && form.productType === 'O' && !value) {
        newErr[name] = 'Product Type Other is required when Product Type is Other';
      }
      if (name === 'hindiSubFlag' && !value) newErr[name] = 'Hindi Sub Flag is required';
      if (name === 'subscriberDeclaration' && !value) newErr[name] = 'Subscriber Declaration is required';
      if (name === 'employerDeclaration' && !value) newErr[name] = 'Employer Declaration is required';
      if (name === 'existingCustomerPop' && !value) newErr[name] = 'Existing Customer Pop is required';

      // KYC & PAN
      if (name === 'kycVerificationFlag' && !value) newErr[name] = 'KYC Verification Flag is required';
      if (name === 'panVerificationFlag' && form.combinedFormFlag === 'Y' && value !== 'Y') {
        newErr[name] = 'PAN Verification Flag must be Y for combined registration';
      }
      if (name === 'firstNameHindi' && form.hindiSubFlag === 'Y' && !value) {
        newErr[name] = 'First Name in Hindi is required when Hindi Subscription is Y';
      }
      if (name === 'lastNameHindi' && form.hindiSubFlag === 'Y' && form.lastName && !value) {
        newErr[name] = 'Last Name in Hindi is required when Hindi Subscription is Y and Last Name is provided';
      }
      if (name === 'middleNameHindi' && form.hindiSubFlag === 'Y' && form.middleName && !value) {
        newErr[name] = 'Middle Name in Hindi is required when Hindi Subscription is Y and Middle Name is provided';
      }
      if (name === 'idProofExpiryDate' && value && !/^\d{8}$/.test(value)) {
        newErr[name] = 'ID Proof Expiry Date must be in MMDDYYYY format';
      }

      setErrors(newErr);
    },
    [errors, form.orphan, form.motherFirstName, form.fatherFirstName, form.maritalStatus, 
     form.combinedFormFlag, form.usPerson, form.existingCustomerFlag, form.form60, 
     form.productType, form.hindiSubFlag, form.lastName, form.middleName]
  );

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Function to format date from YYYY-MM-DD to MMDDYYYY for API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}${day}${year}`;
  };

  // ---------- FULL FORM VALIDATION ----------
  const validateAll = () => {
    const mandatory = [
      'title', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'orphan',
      'placeOfBirth', 'countryOfBirth', 'maritalStatus', 'mobile', 'email',
      'dobProof', 'ePranWelcomePlan', 'modeOfRegistration', 'npsOnBoarding',
      'hindiSubFlag', 'subscriberDeclaration', 'employerDeclaration',
      'existingCustomerPop', 'kycVerificationFlag', 'form60'
    ];

    const newErr = {};
    mandatory.forEach((f) => {
      if (!form[f]) newErr[f] = 'Required';
    });

    // Conditional validations
    if (form.orphan !== 'Y' && !form.fatherFirstName && !form.motherFirstName) {
      newErr.fatherFirstName = 'Either Father\'s or Mother\'s name is required';
    }
    
    if (form.maritalStatus === 'M' && !form.spouseFirstName) {
      newErr.spouseFirstName = 'Spouse First Name is required if married';
    }
    
    if (form.combinedFormFlag === 'Y' && !form.pan) {
      newErr.pan = 'PAN is mandatory for combined registration';
    }
    
    if (form.form60 === 'Y' && !form.form60f) {
      newErr.form60f = 'Form 60 Financial Year is required when Form 60 is selected';
    }
    
    if (form.hindiSubFlag === 'Y' && !form.firstNameHindi) {
      newErr.firstNameHindi = 'First Name in Hindi is required when Hindi Subscription is Y';
    }

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
    subDob: formatDateForAPI(form.dateOfBirth), // Format date for API
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
    pan: form.pan,
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
    modeOfAnnualSot: form.modeOfAnnualSot,
    displayNameFlag: form.displayNameFlag,
    usPerson: form.usPerson,
    existingCustomerFlag: form.existingCustomerFlag
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
                type="date"
                className="form-input"
                value={form.dateOfBirth} // Directly use the stored value
                onChange={(e) => handleChange('dateOfBirth', e.target.value)} // Store as YYYY-MM-DD
                max={new Date().toISOString().split('T')[0]} // Set max date to today
              />
              {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
            </label>

            <label className={`form-field${errors.gender ? ' has-error' : ''}`}>
              <span className="form-label">
                Gender <span className="required">*</span>
              </span>
              <select className="form-input" value={form.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="T">Transgender</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </label>

            <label className={`form-field${errors.orphan ? ' has-error' : ''}`}>
              <span className="form-label">
                Orphan <span className="required">*</span>
              </span>
              <select className="form-input" value={form.orphan} onChange={(e) => handleChange('orphan', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
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
                <option value="AF">Afghanistan</option>
                <option value="AL">Albania</option>
                <option value="DZ">Algeria</option>
                <option value="AS">American Samoa</option>
                <option value="AD">Andorra</option>
                <option value="AO">Angola</option>
                <option value="AI">Anguilla</option>
                <option value="AQ">Antarctica</option>
                <option value="AG">Antigua and Barbuda</option>
                <option value="AR">Argentina</option>
                <option value="AM">Armenia</option>
                <option value="AW">Aruba</option>
                <option value="AU">Australia</option>
                <option value="AT">Austria</option>
                <option value="AZ">Azerbaijan</option>
                <option value="BS">Bahamas</option>
                <option value="BH">Bahrain</option>
                <option value="BD">Bangladesh</option>
                <option value="BB">Barbados</option>
                <option value="BY">Belarus</option>
                <option value="BE">Belgium</option>
                <option value="BZ">Belize</option>
                <option value="BJ">Benin</option>
                <option value="BM">Bermuda</option>
                <option value="BT">Bhutan</option>
                <option value="BO">Bolivia</option>
                <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                <option value="BA">Bosnia and Herzegovina</option>
                <option value="BW">Botswana</option>
                <option value="BV">Bouvet Island</option>
                <option value="BR">Brazil</option>
                <option value="IO">British Indian Ocean Territory</option>
                <option value="BN">Brunei Darussalam</option>
                <option value="BG">Bulgaria</option>
                <option value="BF">Burkina Faso</option>
                <option value="BI">Burundi</option>
                <option value="CV">Cabo Verde</option>
                <option value="KH">Cambodia</option>
                <option value="CM">Cameroon</option>
                <option value="CA">Canada</option>
                <option value="KY">Cayman Islands</option>
                <option value="CF">Central African Republic</option>
                <option value="TD">Chad</option>
                <option value="CL">Chile</option>
                <option value="CN">China</option>
                <option value="CX">Christmas Island</option>
                <option value="CC">Cocos (Keeling) Islands</option>
                <option value="CO">Colombia</option>
                <option value="KM">Comoros</option>
                <option value="CG">Congo</option>
                <option value="CD">Congo, Democratic Republic of the</option>
                <option value="CK">Cook Islands</option>
                <option value="CR">Costa Rica</option>
                <option value="CI">Côte d'Ivoire</option>
                <option value="HR">Croatia</option>
                <option value="CU">Cuba</option>
                <option value="CW">Curaçao</option>
                <option value="CY">Cyprus</option>
                <option value="CZ">Czechia</option>
                <option value="DK">Denmark</option>
                <option value="DJ">Djibouti</option>
                <option value="DM">Dominica</option>
                <option value="DO">Dominican Republic</option>
                <option value="EC">Ecuador</option>
                <option value="EG">Egypt</option>
                <option value="SV">El Salvador</option>
                <option value="GQ">Equatorial Guinea</option>
                <option value="ER">Eritrea</option>
                <option value="EE">Estonia</option>
                <option value="SZ">Eswatini</option>
                <option value="ET">Ethiopia</option>
                <option value="FK">Falkland Islands (Malvinas)</option>
                <option value="FO">Faroe Islands</option>
                <option value="FJ">Fiji</option>
                <option value="FI">Finland</option>
                <option value="FR">France</option>
                <option value="GF">French Guiana</option>
                <option value="PF">French Polynesia</option>
                <option value="TF">French Southern Territories</option>
                <option value="GA">Gabon</option>
                <option value="GM">Gambia</option>
                <option value="GE">Georgia</option>
                <option value="DE">Germany</option>
                <option value="GH">Ghana</option>
                <option value="GI">Gibraltar</option>
                <option value="GR">Greece</option>
                <option value="GL">Greenland</option>
                <option value="GD">Grenada</option>
                <option value="GP">Guadeloupe</option>
                <option value="GU">Guam</option>
                <option value="GT">Guatemala</option>
                <option value="GG">Guernsey</option>
                <option value="GN">Guinea</option>
                <option value="GW">Guinea-Bissau</option>
                <option value="GY">Guyana</option>
                <option value="HT">Haiti</option>
                <option value="HM">Heard Island and McDonald Islands</option>
                <option value="VA">Holy See</option>
                <option value="HN">Honduras</option>
                <option value="HK">Hong Kong</option>
                <option value="HU">Hungary</option>
                <option value="IS">Iceland</option>
                <option value="IN">India</option>
                <option value="ID">Indonesia</option>
                <option value="IR">Iran, Islamic Republic of</option>
                <option value="IQ">Iraq</option>
                <option value="IE">Ireland</option>
                <option value="IM">Isle of Man</option>
                <option value="IL">Israel</option>
                <option value="IT">Italy</option>
                <option value="JM">Jamaica</option>
                <option value="JP">Japan</option>
                <option value="JE">Jersey</option>
                <option value="JO">Jordan</option>
                <option value="KZ">Kazakhstan</option>
                <option value="KE">Kenya</option>
                <option value="KI">Kiribati</option>
                <option value="KP">Korea, Democratic People's Republic of</option>
                <option value="KR">Korea, Republic of</option>
                <option value="KW">Kuwait</option>
                <option value="KG">Kyrgyzstan</option>
                <option value="LA">Lao People's Democratic Republic</option>
                <option value="LV">Latvia</option>
                <option value="LB">Lebanon</option>
                <option value="LS">Lesotho</option>
                <option value="LR">Liberia</option>
                <option value="LY">Libya</option>
                <option value="LI">Liechtenstein</option>
                <option value="LT">Lithuania</option>
                <option value="LU">Luxembourg</option>
                <option value="MO">Macao</option>
                <option value="MG">Madagascar</option>
                <option value="MW">Malawi</option>
                <option value="MY">Malaysia</option>
                <option value="MV">Maldives</option>
                <option value="ML">Mali</option>
                <option value="MT">Malta</option>
                <option value="MH">Marshall Islands</option>
                <option value="MQ">Martinique</option>
                <option value="MR">Mauritania</option>
                <option value="MU">Mauritius</option>
                <option value="YT">Mayotte</option>
                <option value="MX">Mexico</option>
                <option value="FM">Micronesia, Federated States of</option>
                <option value="MD">Moldova, Republic of</option>
                <option value="MC">Monaco</option>
                <option value="MN">Mongolia</option>
                <option value="ME">Montenegro</option>
                <option value="MS">Montserrat</option>
                <option value="MA">Morocco</option>
                <option value="MZ">Mozambique</option>
                <option value="MM">Myanmar</option>
                <option value="NA">Namibia</option>
                <option value="NR">Nauru</option>
                <option value="NP">Nepal</option>
                <option value="NL">Netherlands</option>
                <option value="NC">New Caledonia</option>
                <option value="NZ">New Zealand</option>
                <option value="NI">Nicaragua</option>
                <option value="NE">Niger</option>
                <option value="NG">Nigeria</option>
                <option value="NU">Niue</option>
                <option value="NF">Norfolk Island</option>
                <option value="MK">North Macedonia</option>
                <option value="MP">Northern Mariana Islands</option>
                <option value="NO">Norway</option>
                <option value="OM">Oman</option>
                <option value="PK">Pakistan</option>
                <option value="PW">Palau</option>
                <option value="PS">Palestine, State of</option>
                <option value="PA">Panama</option>
                <option value="PG">Papua New Guinea</option>
                <option value="PY">Paraguay</option>
                <option value="PE">Peru</option>
                <option value="PH">Philippines</option>
                <option value="PN">Pitcairn</option>
                <option value="PL">Poland</option>
                <option value="PT">Portugal</option>
                <option value="PR">Puerto Rico</option>
                <option value="QA">Qatar</option>
                <option value="RE">Réunion</option>
                <option value="RO">Romania</option>
                <option value="RU">Russian Federation</option>
                <option value="RW">Rwanda</option>
                <option value="BL">Saint Barthélemy</option>
                <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                <option value="KN">Saint Kitts and Nevis</option>
                <option value="LC">Saint Lucia</option>
                <option value="MF">Saint Martin (French part)</option>
                <option value="PM">Saint Pierre and Miquelon</option>
                <option value="VC">Saint Vincent and the Grenadines</option>
                <option value="WS">Samoa</option>
                <option value="SM">San Marino</option>
                <option value="ST">Sao Tome and Principe</option>
                <option value="SA">Saudi Arabia</option>
                <option value="SN">Senegal</option>
                <option value="RS">Serbia</option>
                <option value="SC">Seychelles</option>
                <option value="SL">Sierra Leone</option>
                <option value="SG">Singapore</option>
                <option value="SX">Sint Maarten (Dutch part)</option>
                <option value="SK">Slovakia</option>
                <option value="SI">Slovenia</option>
                <option value="SB">Solomon Islands</option>
                <option value="SO">Somalia</option>
                <option value="ZA">South Africa</option>
                <option value="GS">South Georgia and the South Sandwich Islands</option>
                <option value="SS">South Sudan</option>
                <option value="ES">Spain</option>
                <option value="LK">Sri Lanka</option>
                <option value="SD">Sudan</option>
                <option value="SR">Suriname</option>
                <option value="SJ">Svalbard and Jan Mayen</option>
                <option value="SE">Sweden</option>
                <option value="CH">Switzerland</option>
                <option value="SY">Syrian Arab Republic</option>
                <option value="TW">Taiwan, Province of China</option>
                <option value="TJ">Tajikistan</option>
                <option value="TZ">Tanzania, United Republic of</option>
                <option value="TH">Thailand</option>
                <option value="TL">Timor-Leste</option>
                <option value="TG">Togo</option>
                <option value="TK">Tokelau</option>
                <option value="TO">Tonga</option>
                <option value="TT">Trinidad and Tobago</option>
                <option value="TN">Tunisia</option>
                <option value="TR">Turkey</option>
                <option value="TM">Turkmenistan</option>
                <option value="TC">Turks and Caicos Islands</option>
                <option value="TV">Tuvalu</option>
                <option value="UG">Uganda</option>
                <option value="UA">Ukraine</option>
                <option value="AE">United Arab Emirates</option>
                <option value="GB">United Kingdom of Great Britain and Northern Ireland</option>
                <option value="US">United States of America</option>
                <option value="UM">United States Minor Outlying Islands</option>
                <option value="UY">Uruguay</option>
                <option value="UZ">Uzbekistan</option>
                <option value="VU">Vanuatu</option>
                <option value="VE">Venezuela, Bolivarian Republic of</option>
                <option value="VN">Viet Nam</option>
                <option value="VG">Virgin Islands, British</option>
                <option value="VI">Virgin Islands, U.S.</option>
                <option value="WF">Wallis and Futuna</option>
                <option value="EH">Western Sahara</option>
                <option value="YE">Yemen</option>
                <option value="ZM">Zambia</option>
                <option value="ZW">Zimbabwe</option>
              </select>
              {errors.countryOfBirth && <span className="error-text">{errors.countryOfBirth}</span>}
            </label>

            <label className={`form-field${errors.maritalStatus ? ' has-error' : ''}`}>
              <span className="form-label">
                Marital Status <span className="required">*</span>
              </span>
              <select className="form-input" value={form.maritalStatus} onChange={(e) => handleChange('maritalStatus', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="M">Married</option>
                <option value="U">Unmarried</option>
                <option value="D">Divorced</option>
                <option value="W">Widow/Widower</option>
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
                  let v = e.target.value;
                  if (v && !v.startsWith('+')) v = '+' + v.replace(/\D/g, '');
                  else if (v) v = '+' + v.substring(1).replace(/\D/g, '');
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
                  let v = e.target.value;
                  if (v && !v.startsWith('+')) v = '+' + v.replace(/\D/g, '');
                  else if (v) v = '+' + v.substring(1).replace(/\D/g, '');
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
            <label className={`form-field${errors.fatherFirstName ? ' has-error' : ''}`}>
              <span className="form-label">Father's First Name</span>
              <input type="text" className="form-input" value={form.fatherFirstName} onChange={(e) => handleChange('fatherFirstName', e.target.value)} />
              {errors.fatherFirstName && <span className="error-text">{errors.fatherFirstName}</span>}
            </label>

            <label className="form-field">
              <span className="form-label">Father's Middle Name</span>
              <input type="text" className="form-input" value={form.fatherMiddleName} onChange={(e) => handleChange('fatherMiddleName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Father's Last Name</span>
              <input type="text" className="form-input" value={form.fatherLastName} onChange={(e) => handleChange('fatherLastName', e.target.value)} />
            </label>

            <label className={`form-field${errors.motherFirstName ? ' has-error' : ''}`}>
              <span className="form-label">Mother's First Name</span>
              <input type="text" className="form-input" value={form.motherFirstName} onChange={(e) => handleChange('motherFirstName', e.target.value)} />
              {errors.motherFirstName && <span className="error-text">{errors.motherFirstName}</span>}
            </label>

            <label className="form-field">
              <span className="form-label">Mother's Middle Name</span>
              <input type="text" className="form-input" value={form.motherMiddleName} onChange={(e) => handleChange('motherMiddleName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Mother's Last Name</span>
              <input type="text" className="form-input" value={form.motherLastName} onChange={(e) => handleChange('motherLastName', e.target.value)} />
            </label>

            <label className={`form-field${errors.spouseFirstName ? ' has-error' : ''}`}>
              <span className="form-label">Spouse First Name</span>
              <input type="text" className="form-input" value={form.spouseFirstName} onChange={(e) => handleChange('spouseFirstName', e.target.value)} />
              {errors.spouseFirstName && <span className="error-text">{errors.spouseFirstName}</span>}
            </label>

            <label className="form-field">
              <span className="form-label">Spouse Middle Name</span>
              <input type="text" className="form-input" value={form.spouseMiddleName} onChange={(e) => handleChange('spouseMiddleName', e.target.value)} />
            </label>

            <label className="form-field">
              <span className="form-label">Spouse Last Name</span>
              <input type="text" className="form-input" value={form.spouseLastName} onChange={(e) => handleChange('spouseLastName', e.target.value)} />
            </label>

            <label className={`form-field${errors.pan ? ' has-error' : ''}`}>
              <span className="form-label">PAN</span>
              <input type="text" className="form-input" value={form.pan} onChange={(e) => handleChange('pan', e.target.value)} />
              {errors.pan && <span className="error-text">{errors.pan}</span>}
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
            <label className={`form-field${errors.idProof ? ' has-error' : ''}`}>
              <span className="form-label">ID Proof</span>
              <select className="form-input" value={form.idProof} onChange={(e) => handleChange('idProof', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="101">Aadhaar Card</option>
                <option value="102">Bank Passbook with Photo</option>
                <option value="103">Passport</option>
                <option value="104">Driving License</option>
                <option value="105">Ration Card with Photo</option>
                <option value="106">Arms License</option>
                <option value="107">Pension Card with Photo</option>
                <option value="108">CGHS Card</option>
                <option value="109">Ex-Servicemen Contributory Health Scheme Photo Card</option>
                <option value="110">Photo ID issued by Central/State Govt.</option>
                <option value="111">Photo ID issued by PSU</option>
                <option value="112">Freedom Fighter Photo Card</option>
                <option value="113">Photo Card having address issued by Statutory Authority</option>
                <option value="114">Photo Card having address issued by a Gazetted Officer</option>
                <option value="115">Photo Card having address issued by a Registrar</option>
                <option value="116">Photo Card having address issued by a Post Master</option>
                <option value="117">Photo Card having address issued by a Bank Manager</option>
                <option value="118">Election Commission ID Card</option>
                <option value="119">PAN Card</option>
                <option value="120">Birth Certificate</option>
                <option value="121">Others</option>
                <option value="122">Student Photo ID Card issued by Recognized Educational Institution</option>
                <option value="123">Marriage Certificate issued by State Govt.</option>
                <option value="124">Divorce Decree</option>
                <option value="125">Legal Heir Certificate</option>
                <option value="126">Passport of Spouse</option>
                <option value="127">Passport of Parents</option>
                <option value="128">Passport of Guardian</option>
                <option value="129">Certificate of Identity having photo signed by a Gazetted Officer</option>
                <option value="130">Certificate of Identity having photo signed by a Municipal Councilor</option>
                <option value="131">Certificate of Identity having photo signed by a MP</option>
                <option value="132">Certificate of Identity having photo signed by a MLA</option>
                <option value="133">Certificate of Identity having photo signed by a Gazetted Officer</option>
                <option value="134">Certificate of Identity having photo signed by a Municipal Councilor</option>
                <option value="135">Certificate of Identity having photo signed by a MP</option>
                <option value="136">Certificate of Identity having photo signed by a MLA</option>
                <option value="137">Certificate of Identity having photo signed by a Bank Manager</option>
                <option value="138">Certificate of Identity having photo signed by a Post Master</option>
                <option value="139">Certificate of Identity having photo signed by a Registrar</option>
                <option value="140">Certificate of Identity having photo signed by a Statutory Authority</option>
                <option value="141">Certificate of Identity having photo signed by a Central/State Govt.</option>
                <option value="142">Certificate of the POP Bank for an existing bank customer</option>
                <option value="152">Certificate of Identity having photo signed by a Central/State Govt.</option>
                <option value="153">Certificate of Identity having photo signed by a PSU</option>
                <option value="154">Certificate of Identity having photo signed by a Gazetted Officer</option>
                <option value="155">Certificate of Identity having photo signed by a Municipal Councilor</option>
                <option value="156">Certificate of Identity having photo signed by a MP</option>
                <option value="157">Certificate of Identity having photo signed by a MLA</option>
                <option value="158">Certificate of Identity having photo signed by a Bank Manager</option>
                <option value="159">Certificate of Identity having photo signed by a Post Master</option>
                <option value="160">Certificate of Identity having photo signed by a Registrar</option>
                <option value="161">Certificate of Identity having photo signed by a Statutory Authority</option>
                <option value="162">OCI Card</option>
                <option value="163">NPR Smart Card</option>
                <option value="164">Voter ID Card</option>
                <option value="165">Driving License</option>
                <option value="166">Passport</option>
                <option value="167">PAN Card</option>
                <option value="168">Aadhaar Card</option>
                <option value="333">Others</option>
              </select>
              {errors.idProof && <span className="error-text">{errors.idProof}</span>}
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
                <option value="101">Aadhaar Card</option>
                <option value="102">Bank Passbook with Photo</option>
                <option value="103">Passport</option>
                <option value="104">Driving License</option>
                <option value="105">Ration Card with Photo</option>
                <option value="106">Arms License</option>
                <option value="107">Pension Card with Photo</option>
                <option value="108">CGHS Card</option>
                <option value="109">Ex-Servicemen Contributory Health Scheme Photo Card</option>
                <option value="110">Photo ID issued by Central/State Govt.</option>
                <option value="111">Photo ID issued by PSU</option>
                <option value="112">Freedom Fighter Photo Card</option>
                <option value="113">Photo Card having address issued by Statutory Authority</option>
                <option value="114">Photo Card having address issued by a Gazetted Officer</option>
                <option value="115">Photo Card having address issued by a Registrar</option>
                <option value="116">Photo Card having address issued by a Post Master</option>
                <option value="117">Photo Card having address issued by a Bank Manager</option>
                <option value="118">Election Commission ID Card</option>
                <option value="119">PAN Card</option>
                <option value="120">Birth Certificate</option>
                <option value="121">Others</option>
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
                placeholder="1234"
                value={form.last4Aadhaar}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  handleChange('last4Aadhaar', v);
                }}
              />
              {errors.last4Aadhaar && <span className="error-text">{errors.last4Aadhaar}</span>}
            </label>

            <label className={`form-field${errors.form60 ? ' has-error' : ''}`}>
              <span className="form-label">Form 60 Flag</span>
              <select className="form-input" value={form.form60} onChange={(e) => handleChange('form60', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
              {errors.form60 && <span className="error-text">{errors.form60}</span>}
            </label>

            <label className={`form-field${errors.form60f ? ' has-error' : ''}`}>
              <span className="form-label">Form 60 Financial Year</span>
              <input type="text" className="form-input" placeholder="YYYY-YYYY" value={form.form60f} onChange={(e) => handleChange('form60f', e.target.value)} />
              {errors.form60f && <span className="error-text">{errors.form60f}</span>}
            </label>

            <label className={`form-field${errors.ePranWelcomePlan ? ' has-error' : ''}`}>
              <span className="form-label">
                E-Pran Welcome Plan <span className="required">*</span>
              </span>
              <select className="form-input" value={form.ePranWelcomePlan} onChange={(e) => handleChange('ePranWelcomePlan', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="1">Physical PRAN Card along with Welcome Kit</option>
                <option value="2">ePRAN Card – Physical Welcome kit</option>
                <option value="3">ePRAN Card – Welcome kit by email</option>
              </select>
              {errors.ePranWelcomePlan && <span className="error-text">{errors.ePranWelcomePlan}</span>}
            </label>

            <label className={`form-field${errors.modeOfRegistration ? ' has-error' : ''}`}>
              <span className="form-label">
                Mode Of Registration <span className="required">*</span>
              </span>
              <select className="form-input" value={form.modeOfRegistration} onChange={(e) => handleChange('modeOfRegistration', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="SR">API</option>
              </select>
              {errors.modeOfRegistration && <span className="error-text">{errors.modeOfRegistration}</span>}
            </label>

            <label className={`form-field${errors.npsOnBoarding ? ' has-error' : ''}`}>
              <span className="form-label">
                NPS On Boarding <span className="required">*</span>
              </span>
              <select className="form-input" value={form.npsOnBoarding} onChange={(e) => handleChange('npsOnBoarding', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="P">Walk In/ Non Digital</option>
                <option value="E">Digital - eSign Authentication</option>
                <option value="O">Digital - OTP Authentication</option>
                <option value="F">Digital - Physical Form Submission</option>
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
              <select className="form-input" value={form.productType} onChange={(e) => handleChange('productType', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="D">Demat</option>
                <option value="F">Folio</option>
                <option value="P">Policy</option>
                <option value="O">Others</option>
                <option value="B">Basic Savings Bank Deposit Account</option>
              </select>
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
              </select>
              {errors.employerDeclaration && <span className="error-text">{errors.employerDeclaration}</span>}
            </label>

            <label className={`form-field${errors.existingCustomerPop ? ' has-error' : ''}`}>
              <span className="form-label">
                Existing Customer Confirmation by POP <span className="required">*</span>
              </span>
              <select className="form-input" value={form.existingCustomerPop} onChange={(e) => handleChange('existingCustomerPop', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
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
              <select className="form-input" value={form.kycVerificationFlag} onChange={(e) => handleChange('kycVerificationFlag', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
              </select>
              {errors.kycVerificationFlag && <span className="error-text">{errors.kycVerificationFlag}</span>}
            </label>

            <label className={`form-field${errors.panVerificationFlag ? ' has-error' : ''}`}>
              <span className="form-label">PAN Verification Flag</span>
              <select className="form-input" value={form.panVerificationFlag} onChange={(e) => handleChange('panVerificationFlag', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
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
              <span className="form-label">Guardian First Name Hindi</span>
              <input type="text" className="form-input" value={form.guardianFirstName} onChange={(e) => handleChange('guardianFirstName', e.target.value)} />
              {errors.guardianFirstName && <span className="error-text">{errors.guardianFirstName}</span>}
            </label>

            <label className={`form-field${errors.guardianMiddleName ? ' has-error' : ''}`}>
              <span className="form-label">Guardian Middle Name Hindi</span>
              <input type="text" className="form-input" value={form.guardianMiddleName} onChange={(e) => handleChange('guardianMiddleName', e.target.value)} />
              {errors.guardianMiddleName && <span className="error-text">{errors.guardianMiddleName}</span>}
            </label>

            <label className={`form-field${errors.guardianLastName ? ' has-error' : ''}`}>
              <span className="form-label">Guardian Last Name Hindi</span>
              <input type="text" className="form-input" value={form.guardianLastName} onChange={(e) => handleChange('guardianLastName', e.target.value)} />
              {errors.guardianLastName && <span className="error-text">{errors.guardianLastName}</span>}
            </label>

            <label className={`form-field${errors.idProofExpiryDate ? ' has-error' : ''}`}>
              <span className="form-label">ID Proof Expiry Date</span>
              <input
                type="text"
                className="form-input"
                placeholder="MMDDYYYY"
                value={form.idProofExpiryDate}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                  handleChange('idProofExpiryDate', v);
                }}
              />
              {errors.idProofExpiryDate && <span className="error-text">{errors.idProofExpiryDate}</span>}
            </label>

            <label className={`form-field${errors.kycMode ? ' has-error' : ''}`}>
              <span className="form-label">KYC Mode</span>
              <select className="form-input" value={form.kycMode} onChange={(e) => handleChange('kycMode', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="P">Physical KYC</option>
                <option value="M">Video KYC using Mobile base Application</option>
                <option value="V">Video KYC using Non Mobile base Application</option>
              </select>
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
                <option value="P">Physical</option>
                <option value="E">Email</option>
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