import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
    countryOfRes: '',
    nationality: '',
    consentByPOP: '',
    howDidYouHearAboutNPS: '',
    minUploadIndicator: '',
    pregeneratedPranFlag: '',
    productExistingCustomer: '',
    existingCustomerBranchOffice: '',
    popSeCode: '',
    popSeAgentName: '',
    popSeEmployeeId: '',
    existingCustomerFlag: '',
  });

  const [errors, setErrors] = useState({});

  // Create refs for all input fields to enable navigation
  const inputRefs = {
    ackId: useRef(null),
    pranNumber: useRef(null),
    receiptNumber: useRef(null),
    sectorTypeFlag: useRef(null),
    citizenFlag: useRef(null),
    combinedFormFlag: useRef(null),
    popSpRegNo: useRef(null),
    nriBankAccountStatus: useRef(null),
    countryOfRes: useRef(null),
    nationality: useRef(null),
    consentByPOP: useRef(null),
    howDidYouHearAboutNPS: useRef(null),
    minUploadIndicator: useRef(null),
    pregeneratedPranFlag: useRef(null),
    existingCustomerFlag: useRef(null),
    productExistingCustomer: useRef(null),
    existingCustomerBranchOffice: useRef(null),
    popSeCode: useRef(null),
    popSeAgentName: useRef(null),
    popSeEmployeeId: useRef(null),
  };

  // Define the order of fields for navigation
  const fieldOrder = [
    'ackId',
    'pranNumber',
    'receiptNumber',
    'sectorTypeFlag',
    'citizenFlag',
    'combinedFormFlag',
    'popSpRegNo',
    'nriBankAccountStatus',
    'countryOfRes',
    'nationality',
    'consentByPOP',
    'howDidYouHearAboutNPS',
    'minUploadIndicator',
    'pregeneratedPranFlag',
    'existingCustomerFlag',
    'productExistingCustomer',
    'existingCustomerBranchOffice',
    'popSeCode',
    'popSeAgentName',
    'popSeEmployeeId'
  ];

  // Function to move focus to the next field
  const moveToNextField = useCallback((currentFieldName) => {
    const currentIndex = fieldOrder.indexOf(currentFieldName);
    if (currentIndex !== -1 && currentIndex < fieldOrder.length - 1) {
      const nextFieldName = fieldOrder[currentIndex + 1];
      if (inputRefs[nextFieldName] && inputRefs[nextFieldName].current) {
        inputRefs[nextFieldName].current.focus();
      }
    }
  }, [fieldOrder]);

  // Handle Enter key press
  const handleKeyDown = useCallback((e, fieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      moveToNextField(fieldName);
    }
  }, [moveToNextField]);

  // Country code list (simplified for demonstration)
  // In a real implementation, this should come from a service or API
  const countryCodes = [
    { code: 'IN', name: 'India', nriFlag: 'N' },
    { code: 'AF', name: 'Afghanistan', nriFlag: 'Y' },
    { code: 'AL', name: 'Albania', nriFlag: 'Y' },
    { code: 'DZ', name: 'Algeria', nriFlag: 'Y' },
    { code: 'AD', name: 'Andorra', nriFlag: 'Y' },
    { code: 'AO', name: 'Angola', nriFlag: 'Y' },
    { code: 'AG', name: 'Antigua and Barbuda', nriFlag: 'Y' },
    { code: 'AR', name: 'Argentina', nriFlag: 'Y' },
    { code: 'AM', name: 'Armenia', nriFlag: 'Y' },
    { code: 'AU', name: 'Australia', nriFlag: 'Y' },
    { code: 'AT', name: 'Austria', nriFlag: 'Y' },
    { code: 'AZ', name: 'Azerbaijan', nriFlag: 'Y' },
    { code: 'BS', name: 'Bahamas', nriFlag: 'Y' },
    { code: 'BH', name: 'Bahrain', nriFlag: 'Y' },
    { code: 'BD', name: 'Bangladesh', nriFlag: 'Y' },
    { code: 'BB', name: 'Barbados', nriFlag: 'Y' },
    { code: 'BY', name: 'Belarus', nriFlag: 'Y' },
    { code: 'BE', name: 'Belgium', nriFlag: 'Y' },
    { code: 'BZ', name: 'Belize', nriFlag: 'Y' },
    { code: 'BJ', name: 'Benin', nriFlag: 'Y' },
    { code: 'BT', name: 'Bhutan', nriFlag: 'Y' },
    { code: 'BO', name: 'Bolivia', nriFlag: 'Y' },
    { code: 'BA', name: 'Bosnia and Herzegovina', nriFlag: 'Y' },
    { code: 'BW', name: 'Botswana', nriFlag: 'Y' },
    { code: 'BR', name: 'Brazil', nriFlag: 'Y' },
    { code: 'BN', name: 'Brunei', nriFlag: 'Y' },
    { code: 'BG', name: 'Bulgaria', nriFlag: 'Y' },
    { code: 'BF', name: 'Burkina Faso', nriFlag: 'Y' },
    { code: 'BI', name: 'Burundi', nriFlag: 'Y' },
    { code: 'CV', name: 'Cabo Verde', nriFlag: 'Y' },
    { code: 'KH', name: 'Cambodia', nriFlag: 'Y' },
    { code: 'CM', name: 'Cameroon', nriFlag: 'Y' },
    { code: 'CA', name: 'Canada', nriFlag: 'Y' },
    { code: 'CF', name: 'Central African Republic', nriFlag: 'Y' },
    { code: 'TD', name: 'Chad', nriFlag: 'Y' },
    { code: 'CL', name: 'Chile', nriFlag: 'Y' },
    { code: 'CN', name: 'China', nriFlag: 'Y' },
    { code: 'CO', name: 'Colombia', nriFlag: 'Y' },
    { code: 'KM', name: 'Comoros', nriFlag: 'Y' },
    { code: 'CG', name: 'Congo', nriFlag: 'Y' },
    { code: 'CR', name: 'Costa Rica', nriFlag: 'Y' },
    { code: 'HR', name: 'Croatia', nriFlag: 'Y' },
    { code: 'CU', name: 'Cuba', nriFlag: 'Y' },
    { code: 'CY', name: 'Cyprus', nriFlag: 'Y' },
    { code: 'CZ', name: 'Czechia', nriFlag: 'Y' },
    { code: 'DK', name: 'Denmark', nriFlag: 'Y' },
    { code: 'DJ', name: 'Djibouti', nriFlag: 'Y' },
    { code: 'DM', name: 'Dominica', nriFlag: 'Y' },
    { code: 'DO', name: 'Dominican Republic', nriFlag: 'Y' },
    { code: 'EC', name: 'Ecuador', nriFlag: 'Y' },
    { code: 'EG', name: 'Egypt', nriFlag: 'Y' },
    { code: 'SV', name: 'El Salvador', nriFlag: 'Y' },
    { code: 'GQ', name: 'Equatorial Guinea', nriFlag: 'Y' },
    { code: 'ER', name: 'Eritrea', nriFlag: 'Y' },
    { code: 'EE', name: 'Estonia', nriFlag: 'Y' },
    { code: 'SZ', name: 'Eswatini', nriFlag: 'Y' },
    { code: 'ET', name: 'Ethiopia', nriFlag: 'Y' },
    { code: 'FJ', name: 'Fiji', nriFlag: 'Y' },
    { code: 'FI', name: 'Finland', nriFlag: 'Y' },
    { code: 'FR', name: 'France', nriFlag: 'Y' },
    { code: 'GA', name: 'Gabon', nriFlag: 'Y' },
    { code: 'GM', name: 'Gambia', nriFlag: 'Y' },
    { code: 'GE', name: 'Georgia', nriFlag: 'Y' },
    { code: 'DE', name: 'Germany', nriFlag: 'Y' },
    { code: 'GH', name: 'Ghana', nriFlag: 'Y' },
    { code: 'GR', name: 'Greece', nriFlag: 'Y' },
    { code: 'GD', name: 'Grenada', nriFlag: 'Y' },
    { code: 'GT', name: 'Guatemala', nriFlag: 'Y' },
    { code: 'GN', name: 'Guinea', nriFlag: 'Y' },
    { code: 'GW', name: 'Guinea-Bissau', nriFlag: 'Y' },
    { code: 'GY', name: 'Guyana', nriFlag: 'Y' },
    { code: 'HT', name: 'Haiti', nriFlag: 'Y' },
    { code: 'HN', name: 'Honduras', nriFlag: 'Y' },
    { code: 'HU', name: 'Hungary', nriFlag: 'Y' },
    { code: 'IS', name: 'Iceland', nriFlag: 'Y' },
    { code: 'ID', name: 'Indonesia', nriFlag: 'Y' },
    { code: 'IR', name: 'Iran', nriFlag: 'Y' },
    { code: 'IQ', name: 'Iraq', nriFlag: 'Y' },
    { code: 'IE', name: 'Ireland', nriFlag: 'Y' },
    { code: 'IL', name: 'Israel', nriFlag: 'Y' },
    { code: 'IT', name: 'Italy', nriFlag: 'Y' },
    { code: 'JM', name: 'Jamaica', nriFlag: 'Y' },
    { code: 'JP', name: 'Japan', nriFlag: 'Y' },
    { code: 'JO', name: 'Jordan', nriFlag: 'Y' },
    { code: 'KZ', name: 'Kazakhstan', nriFlag: 'Y' },
    { code: 'KE', name: 'Kenya', nriFlag: 'Y' },
    { code: 'KI', name: 'Kiribati', nriFlag: 'Y' },
    { code: 'KW', name: 'Kuwait', nriFlag: 'Y' },
    { code: 'KG', name: 'Kyrgyzstan', nriFlag: 'Y' },
    { code: 'LA', name: "Lao People's Democratic Republic", nriFlag: 'Y' },
    { code: 'LV', name: 'Latvia', nriFlag: 'Y' },
    { code: 'LB', name: 'Lebanon', nriFlag: 'Y' },
    { code: 'LS', name: 'Lesotho', nriFlag: 'Y' },
    { code: 'LR', name: 'Liberia', nriFlag: 'Y' },
    { code: 'LY', name: 'Libya', nriFlag: 'Y' },
    { code: 'LI', name: 'Liechtenstein', nriFlag: 'Y' },
    { code: 'LT', name: 'Lithuania', nriFlag: 'Y' },
    { code: 'LU', name: 'Luxembourg', nriFlag: 'Y' },
    { code: 'MG', name: 'Madagascar', nriFlag: 'Y' },
    { code: 'MW', name: 'Malawi', nriFlag: 'Y' },
    { code: 'MY', name: 'Malaysia', nriFlag: 'Y' },
    { code: 'MV', name: 'Maldives', nriFlag: 'Y' },
    { code: 'ML', name: 'Mali', nriFlag: 'Y' },
    { code: 'MT', name: 'Malta', nriFlag: 'Y' },
    { code: 'MH', name: 'Marshall Islands', nriFlag: 'Y' },
    { code: 'MR', name: 'Mauritania', nriFlag: 'Y' },
    { code: 'MU', name: 'Mauritius', nriFlag: 'Y' },
    { code: 'MX', name: 'Mexico', nriFlag: 'Y' },
    { code: 'FM', name: 'Micronesia', nriFlag: 'Y' },
    { code: 'MD', name: 'Moldova', nriFlag: 'Y' },
    { code: 'MC', name: 'Monaco', nriFlag: 'Y' },
    { code: 'MN', name: 'Mongolia', nriFlag: 'Y' },
    { code: 'ME', name: 'Montenegro', nriFlag: 'Y' },
    { code: 'MA', name: 'Morocco', nriFlag: 'Y' },
    { code: 'MZ', name: 'Mozambique', nriFlag: 'Y' },
    { code: 'MM', name: 'Myanmar', nriFlag: 'Y' },
    { code: 'NA', name: 'Namibia', nriFlag: 'Y' },
    { code: 'NR', name: 'Nauru', nriFlag: 'Y' },
    { code: 'NP', name: 'Nepal', nriFlag: 'Y' },
    { code: 'NL', name: 'Netherlands', nriFlag: 'Y' },
    { code: 'NZ', name: 'New Zealand', nriFlag: 'Y' },
    { code: 'NI', name: 'Nicaragua', nriFlag: 'Y' },
    { code: 'NE', name: 'Niger', nriFlag: 'Y' },
    { code: 'NG', name: 'Nigeria', nriFlag: 'Y' },
    { code: 'MK', name: 'North Macedonia', nriFlag: 'Y' },
    { code: 'NO', name: 'Norway', nriFlag: 'Y' },
    { code: 'OM', name: 'Oman', nriFlag: 'Y' },
    { code: 'PK', name: 'Pakistan', nriFlag: 'Y' },
    { code: 'PW', name: 'Palau', nriFlag: 'Y' },
    { code: 'PA', name: 'Panama', nriFlag: 'Y' },
    { code: 'PG', name: 'Papua New Guinea', nriFlag: 'Y' },
    { code: 'PY', name: 'Paraguay', nriFlag: 'Y' },
    { code: 'PE', name: 'Peru', nriFlag: 'Y' },
    { code: 'PH', name: 'Philippines', nriFlag: 'Y' },
    { code: 'PL', name: 'Poland', nriFlag: 'Y' },
    { code: 'PT', name: 'Portugal', nriFlag: 'Y' },
    { code: 'QA', name: 'Qatar', nriFlag: 'Y' },
    { code: 'RO', name: 'Romania', nriFlag: 'Y' },
    { code: 'RU', name: 'Russian Federation', nriFlag: 'Y' },
    { code: 'RW', name: 'Rwanda', nriFlag: 'Y' },
    { code: 'KN', name: 'Saint Kitts and Nevis', nriFlag: 'Y' },
    { code: 'LC', name: 'Saint Lucia', nriFlag: 'Y' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', nriFlag: 'Y' },
    { code: 'WS', name: 'Samoa', nriFlag: 'Y' },
    { code: 'SM', name: 'San Marino', nriFlag: 'Y' },
    { code: 'ST', name: 'Sao Tome and Principe', nriFlag: 'Y' },
    { code: 'SA', name: 'Saudi Arabia', nriFlag: 'Y' },
    { code: 'SN', name: 'Senegal', nriFlag: 'Y' },
    { code: 'RS', name: 'Serbia', nriFlag: 'Y' },
    { code: 'SC', name: 'Seychelles', nriFlag: 'Y' },
    { code: 'SL', name: 'Sierra Leone', nriFlag: 'Y' },
    { code: 'SG', name: 'Singapore', nriFlag: 'Y' },
    { code: 'SK', name: 'Slovakia', nriFlag: 'Y' },
    { code: 'SI', name: 'Slovenia', nriFlag: 'Y' },
    { code: 'SB', name: 'Solomon Islands', nriFlag: 'Y' },
    { code: 'SO', name: 'Somalia', nriFlag: 'Y' },
    { code: 'ZA', name: 'South Africa', nriFlag: 'Y' },
    { code: 'KR', name: 'South Korea', nriFlag: 'Y' },
    { code: 'SS', name: 'South Sudan', nriFlag: 'Y' },
    { code: 'ES', name: 'Spain', nriFlag: 'Y' },
    { code: 'LK', name: 'Sri Lanka', nriFlag: 'Y' },
    { code: 'SD', name: 'Sudan', nriFlag: 'Y' },
    { code: 'SR', name: 'Suriname', nriFlag: 'Y' },
    { code: 'SE', name: 'Sweden', nriFlag: 'Y' },
    { code: 'CH', name: 'Switzerland', nriFlag: 'Y' },
    { code: 'SY', name: 'Syrian Arab Republic', nriFlag: 'Y' },
    { code: 'TJ', name: 'Tajikistan', nriFlag: 'Y' },
    { code: 'TZ', name: 'Tanzania', nriFlag: 'Y' },
    { code: 'TH', name: 'Thailand', nriFlag: 'Y' },
    { code: 'TL', name: 'Timor-Leste', nriFlag: 'Y' },
    { code: 'TG', name: 'Togo', nriFlag: 'Y' },
    { code: 'TO', name: 'Tonga', nriFlag: 'Y' },
    { code: 'TT', name: 'Trinidad and Tobago', nriFlag: 'Y' },
    { code: 'TN', name: 'Tunisia', nriFlag: 'Y' },
    { code: 'TR', name: 'Turkey', nriFlag: 'Y' },
    { code: 'TM', name: 'Turkmenistan', nriFlag: 'Y' },
    { code: 'TV', name: 'Tuvalu', nriFlag: 'Y' },
    { code: 'UG', name: 'Uganda', nriFlag: 'Y' },
    { code: 'UA', name: 'Ukraine', nriFlag: 'Y' },
    { code: 'AE', name: 'United Arab Emirates', nriFlag: 'Y' },
    { code: 'GB', name: 'United Kingdom', nriFlag: 'Y' },
    { code: 'US', name: 'United States', nriFlag: 'Y' },
    { code: 'UY', name: 'Uruguay', nriFlag: 'Y' },
    { code: 'UZ', name: 'Uzbekistan', nriFlag: 'Y' },
    { code: 'VU', name: 'Vanuatu', nriFlag: 'Y' },
    { code: 'VE', name: 'Venezuela', nriFlag: 'Y' },
    { code: 'VN', name: 'Vietnam', nriFlag: 'Y' },
    { code: 'YE', name: 'Yemen', nriFlag: 'Y' },
    { code: 'ZM', name: 'Zambia', nriFlag: 'Y' },
    { code: 'ZW', name: 'Zimbabwe', nriFlag: 'Y' }
  ];

  // Helper function to check if a country code is valid for NRI
  const isValidNRICountry = (code) => {
    const country = countryCodes.find(c => c.code === code);
    return country && country.nriFlag === 'Y';
  };

  // Helper function to get country name by code
  const getCountryName = (code) => {
    const country = countryCodes.find(c => c.code === code);
    return country ? country.name : '';
  };

  /* ---------- VALIDATION ---------- */
  const validateField = useCallback(
    (name, value) => {
      // Create a new errors object without the current field's error
      const newErr = { ...errors };
      delete newErr[name];

      switch (name) {
        case 'ackId':
          if (!value) {
            newErr.ackId = 'Acknowledgement ID is required';
          } else if (!/^\d{17}$/.test(value)) {
            newErr.ackId = 'Acknowledgement ID must be 17 digits';
          } else if (/^0{17}$/.test(value)) {
            newErr.ackId = 'Acknowledgement ID cannot be all zeros';
          }
          break;

        case 'pranNumber':
          if (value && !/^\d{12}$/.test(value)) {
            newErr.pranNumber = 'PRAN Number must be 12 digits';
          } else if (value && /^0{12}$/.test(value)) {
            newErr.pranNumber = 'PRAN Number cannot be all zeros';
          }
          break;

        case 'receiptNumber':
          if (value && !/^\d{17}$/.test(value)) {
            newErr.receiptNumber = 'Receipt Number must be 17 digits';
          } else if (value && /^0{17}$/.test(value)) {
            newErr.receiptNumber = 'Receipt Number cannot be all zeros';
          }
          break;

        case 'sectorTypeFlag':
          if (!value) {
            newErr.sectorTypeFlag = 'Sector Type is required';
          } else if (!['U', 'C'].includes(value)) {
            newErr.sectorTypeFlag = 'Sector Type must be U or C';
          }
          break;

        case 'citizenFlag':
          if (!value) {
            newErr.citizenFlag = 'Citizen Flag is required';
          } else if (!['Y', 'N', 'O'].includes(value)) {
            newErr.citizenFlag = 'Citizen Flag must be Y, N, or O';
          }
          break;

        case 'combinedFormFlag':
          if (!value) {
            newErr.combinedFormFlag = 'Combined Form Flag is required';
          } else if (!['Y', 'N'].includes(value)) {
            newErr.combinedFormFlag = 'Combined Form Flag must be Y or N';
          }
          break;

        case 'popSpRegNo':
          if (!value) {
            newErr.popSpRegNo = 'POP-SP Registration Number is required';
          } else if (!/^\d{7}$/.test(value)) {
            newErr.popSpRegNo = 'POP-SP Registration Number must be 7 digits';
          }
          break;

        case 'nriBankAccountStatus':
          if (form.citizenFlag === 'Y' || form.citizenFlag === 'O') {
            if (!value) {
              newErr.nriBankAccountStatus = 'NRI Bank Account Status is required for NRI/OCI';
            } else if (!['RP', 'NP'].includes(value)) {
              newErr.nriBankAccountStatus = 'NRI Bank Account Status must be RP or NP';
            }
          }
          break;

        case 'countryOfRes':
          if (!value) {
            newErr.countryOfRes = 'Country of Residency is required';
          } else if (!/^[A-Z]{2}$/.test(value)) {
            newErr.countryOfRes = 'Country of Residency must be 2 characters';
          } else if (form.citizenFlag === 'Y' && value === 'IN') {
            newErr.countryOfRes = 'India (IN) is not allowed for NRI';
          } else if (form.citizenFlag === 'O' && value === 'IN') {
            newErr.countryOfRes = 'India (IN) is not allowed for OCI';
          } else if ((form.citizenFlag === 'Y' || form.citizenFlag === 'O') && !isValidNRICountry(value)) {
            newErr.countryOfRes = 'Invalid country code for NRI/OCI';
          } else if (form.citizenFlag === 'N' && value !== 'IN') {
            newErr.countryOfRes = 'Country of Residency must be India (IN) for Resident Indian';
          }
          break;

        case 'nationality':
          if (!value) {
            newErr.nationality = 'Nationality is required';
          } else if (!/^[A-Z]{3}$/.test(value)) {
            newErr.nationality = 'Nationality must be 3 characters';
          }
          break;

        case 'consentByPOP':
          if (!value) {
            newErr.consentByPOP = 'Consent by POP is required';
          } else if (!['Y', 'N'].includes(value)) {
            newErr.consentByPOP = 'Consent by POP must be Y or N';
          }
          break;

        case 'howDidYouHearAboutNPS':
          if (value && !/^\d{2}$/.test(value)) {
            newErr.howDidYouHearAboutNPS = 'How did you hear about NPS must be 2 digits';
          }
          break;

        case 'minUploadIndicator':
          if (!value) {
            newErr.minUploadIndicator = 'Minimum Upload Indicator is required';
          } else if (!['0', '1', '2', '3', '4'].includes(value)) {
            newErr.minUploadIndicator = 'Minimum Upload Indicator must be 0, 1, 2, 3, or 4';
          }
          break;

        case 'pregeneratedPranFlag':
          if (!value) {
            newErr.pregeneratedPranFlag = 'Pregenerated PRAN Flag is required';
          } else if (!['I', 'M', 'N'].includes(value)) {
            newErr.pregeneratedPranFlag = 'Pregenerated PRAN Flag must be I, M, or N';
          }
          break;

        case 'productExistingCustomer':
          if (value && value.length > 50) {
            newErr.productExistingCustomer = 'Product Existing Customer must be 50 characters or less';
          } else if (value && /^0+$/.test(value)) {
            newErr.productExistingCustomer = 'Product Existing Customer cannot be all zeros';
          }
          break;

        case 'existingCustomerBranchOffice':
          if (value && value.length > 105) {
            newErr.existingCustomerBranchOffice = 'Existing Customer Branch Office must be 105 characters or less';
          }
          break;

        case 'popSeCode':
          if (value && !/^[A-Za-z0-9]{1,13}$/.test(value)) {
            newErr.popSeCode = 'POP SE Code must be alphanumeric and 13 characters or less';
          } else if (value && /^0+$/.test(value)) {
            newErr.popSeCode = 'POP SE Code cannot be all zeros';
          } else if (value && /^ +$/.test(value)) {
            newErr.popSeCode = 'POP SE Code cannot be all spaces';
          }
          break;

        case 'popSeAgentName':
          if (value && value.length > 90) {
            newErr.popSeAgentName = 'POP SE Agent Name must be 90 characters or less';
          }
          break;

        case 'popSeEmployeeId':
          if (value && value.length > 16) {
            newErr.popSeEmployeeId = 'POP SE Employee ID must be 16 characters or less';
          }
          break;
          
        case 'existingCustomerFlag':
          if (value && !['A', 'B', 'N', 'O'].includes(value)) {
            newErr.existingCustomerFlag = 'Existing Customer Flag must be A, B, N, or O';
          }
          break;
      }

      setErrors(newErr);
    },
    [form.citizenFlag] // Removed errors from dependency array to prevent re-creation
  );

  const handleChange = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, [validateField]);

  const validateAll = useCallback(() => {
    // Validate all fields
    Object.keys(form).forEach(key => {
      validateField(key, form[key]);
    });

    // Check for conditional validations
    const newErr = { ...errors };

    // Conditional validation for receipt number (mandatory for Corporate)
    if (form.sectorTypeFlag === 'C' && !form.receiptNumber) {
      newErr.receiptNumber = 'Receipt Number is required for Corporate sector';
    }

    // Conditional validation for NRI Bank Account Status (mandatory for NRI/OCI)
    if ((form.citizenFlag === 'Y' || form.citizenFlag === 'O') && !form.nriBankAccountStatus) {
      newErr.nriBankAccountStatus = 'NRI Bank Account Status is required for NRI/OCI';
    }

    // Conditional validation for Combined Form Flag (must be N for NRI/OCI)
    if ((form.citizenFlag === 'Y' || form.citizenFlag === 'O') && form.combinedFormFlag === 'Y') {
      newErr.combinedFormFlag = 'Combined Form Flag must be N for NRI/OCI';
    }

    // Conditional validation for Product Existing Customer (mandatory when Existing Customer Flag is B/O)
    if (form.existingCustomerFlag && ['B', 'O'].includes(form.existingCustomerFlag) && !form.productExistingCustomer) {
      newErr.productExistingCustomer = 'Product Existing Customer is required when Existing Customer Flag is B or O';
    }

    // Conditional validation for Existing Customer Branch Office (mandatory when Existing Customer Flag is B/O)
    if (form.existingCustomerFlag && ['B', 'O'].includes(form.existingCustomerFlag) && !form.existingCustomerBranchOffice) {
      newErr.existingCustomerBranchOffice = 'Existing Customer Branch Office is required when Existing Customer Flag is B or O';
    }

    // Conditional validation for POP SE fields
    if ((form.popSeAgentName || form.popSeEmployeeId) && !form.popSeCode) {
      newErr.popSeCode = 'POP SE Code is required when POP SE Agent Name or Employee ID is provided';
    }

    if (form.popSeCode && !form.popSeAgentName && !form.popSeEmployeeId) {
      newErr.popSeAgentName = 'POP SE Agent Name or Employee ID is required when POP SE Code is provided';
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  }, [form, errors, validateField]);

  /* ---------- OUTPUT JSON ---------- */
  const getOutputJSON = useCallback(() => ({
    ackId: form.ackId.trim(),
    pranNumber: form.pranNumber.trim() || null,
    receiptNumber: form.receiptNumber.trim() || null,
    sectorTypeFlag: form.sectorTypeFlag,
    citizenFlag: form.citizenFlag,
    combinedFormFlag: form.combinedFormFlag,
    popSpRegNo: form.popSpRegNo.trim(),
    nriBankAccountStatus: form.nriBankAccountStatus || null,
    countryOfRes: form.countryOfRes.trim(),
    nationality: form.nationality.trim(),
    consentByPOP: form.consentByPOP,
    howDidYouHearAboutNPS: form.howDidYouHearAboutNPS || null,
    minUploadIndicator: form.minUploadIndicator,
    pregeneratedPranFlag: form.pregeneratedPranFlag,
    productExistingCustomer: form.productExistingCustomer || null,
    existingCustomerBranchOffice: form.existingCustomerBranchOffice || null,
    popSeCode: form.popSeCode || null,
    popSeAgentName: form.popSeAgentName || null,
    popSeEmployeeId: form.popSeEmployeeId || null,
    existingCustomerFlag: form.existingCustomerFlag || null,
  }), [form]);

  /* ---------- NEXT BUTTON LOGIC ---------- */
  const requiredFilled = useMemo(() => (
    form.ackId &&
    form.sectorTypeFlag &&
    form.citizenFlag &&
    form.combinedFormFlag &&
    form.popSpRegNo &&
    form.countryOfRes &&
    form.nationality &&
    form.consentByPOP &&
    form.minUploadIndicator &&
    form.pregeneratedPranFlag
  ), [form]);

  const nextDisabled = useMemo(() => (
    Object.keys(errors).length > 0 || !requiredFilled
  ), [errors, requiredFilled]);

  const handleNext = useCallback(() => {
    if (validateAll()) {
      const payload = getOutputJSON();
       console.log("Form Data:", payload); // Add this line to log the data
      localStorage.setItem('initialDetails', JSON.stringify(payload));
      if (onNext) onNext(payload);
      navigate("/registration/personal");
    }
  }, [validateAll, getOutputJSON, onNext, navigate]);

  // Auto-set country based on citizen flag
  useEffect(() => {
    if (form.citizenFlag === 'N' && form.countryOfRes !== 'IN') {
      handleChange('countryOfRes', 'IN');
    }
  }, [form.citizenFlag, form.countryOfRes, handleChange]);

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
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                ref={inputRefs.ackId}
                value={form.ackId}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 17);
                  handleChange('ackId', v);
                }}
                onKeyDown={(e) => handleKeyDown(e, 'ackId')}
                placeholder="17 digit number"
                inputMode="numeric"
                maxLength={17}
              />
              {errors.ackId && <span className="error-text">{errors.ackId}</span>}
            </div>
          </div>

          {/* PRAN Number */}
          <div className={`form-field${errors.pranNumber ? ' has-error' : ''}`}>
            <label className="form-label">Pran Number</label>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                ref={inputRefs.pranNumber}
                value={form.pranNumber}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 12);
                  handleChange('pranNumber', v);
                }}
                onKeyDown={(e) => handleKeyDown(e, 'pranNumber')}
                maxLength={12}
                placeholder="12 digit number"
              />
              {errors.pranNumber && (
                <span className="error-text">{errors.pranNumber}</span>
              )}
            </div>
          </div>

          {/* Receipt Number */}
          <div className={`form-field${errors.receiptNumber ? ' has-error' : ''}`}>
            <label className="form-label">
              Receipt Number {form.sectorTypeFlag === 'C' && <span className="required">*</span>}
            </label>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                ref={inputRefs.receiptNumber}
                value={form.receiptNumber}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 17);
                  handleChange('receiptNumber', v);
                }}
                onKeyDown={(e) => handleKeyDown(e, 'receiptNumber')}
                maxLength={17}
                placeholder="17 digit number"
              />
              {errors.receiptNumber && (
                <span className="error-text">{errors.receiptNumber}</span>
              )}
            </div>
          </div>

          {/* Sector Type Flag */}
          <div className={`form-field${errors.sectorTypeFlag ? ' has-error' : ''}`}>
            <label className="form-label">
              Sector Type Flag <span className="required">*</span>
            </label>
            <div className="input-container">
              <select
                className="form-input"
                ref={inputRefs.sectorTypeFlag}
                value={form.sectorTypeFlag}
                onChange={(e) => handleChange('sectorTypeFlag', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'sectorTypeFlag')}
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
          </div>

          {/* Citizen Flag */}
          <div className={`form-field${errors.citizenFlag ? ' has-error' : ''}`}>
            <label className="form-label">
              Citizen Flag <span className="required">*</span>
            </label>
            <div className="input-container">
              <select
                className="form-input"
                ref={inputRefs.citizenFlag}
                value={form.citizenFlag}
                onChange={(e) => handleChange('citizenFlag', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'citizenFlag')}
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
          </div>

          {/* Combined Form Flag */}
          <div className={`form-field${errors.combinedFormFlag ? ' has-error' : ''}`}>
            <label className="form-label">
              Combined Form Flag <span className="required">*</span>
            </label>
            <div className="input-container">
              <select
                className="form-input"
                ref={inputRefs.combinedFormFlag}
                value={form.combinedFormFlag}
                onChange={(e) => handleChange('combinedFormFlag', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'combinedFormFlag')}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="N">N - Tier I only</option>
                <option value="Y" disabled={(form.citizenFlag === 'Y' || form.citizenFlag === 'O')}>
                  Y - Tier I & Tier II (Not available for NRI/OCI)
                </option>
              </select>
              {errors.combinedFormFlag && (
                <span className="error-text">{errors.combinedFormFlag}</span>
              )}
            </div>
          </div>

          {/* Pop Sp Reg No */}
          <div className={`form-field${errors.popSpRegNo ? ' has-error' : ''}`}>
            <label className="form-label">
              Pop Sp Reg No <span className="required">*</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                ref={inputRefs.popSpRegNo}
                value={form.popSpRegNo}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 7);
                  handleChange('popSpRegNo', v);
                }}
                onKeyDown={(e) => handleKeyDown(e, 'popSpRegNo')}
                maxLength={7}
                placeholder="7 digit number"
              />
              {errors.popSpRegNo && (
                <span className="error-text">{errors.popSpRegNo}</span>
              )}
            </div>
          </div>

          {/* NRI Bank Account Status */}
          <div className={`form-field${errors.nriBankAccountStatus ? ' has-error' : ''}`}>
            <label className="form-label">
              NRI Bank Account Status {(form.citizenFlag === 'Y' || form.citizenFlag === 'O') && <span className="required">*</span>}
            </label>
            <div className="input-container">
              <select
                className="form-input"
                ref={inputRefs.nriBankAccountStatus}
                value={form.nriBankAccountStatus}
                onChange={(e) =>
                  handleChange('nriBankAccountStatus', e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, 'nriBankAccountStatus')}
                disabled={!form.citizenFlag || form.citizenFlag === 'N'}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="RP">RP - Repatriable</option>
                <option value="NP">NP - Non-Repatriable</option>
              </select>
              {errors.nriBankAccountStatus && (
                <span className="error-text">{errors.nriBankAccountStatus}</span>
              )}
            </div>
          </div>

          {/* Country Of Residency */}
          <div className={`form-field${errors.countryOfRes ? ' has-error' : ''}`}>
            <label className="form-label">
              Country Of Residency <span className="required">*</span>
            </label>
            <div className="input-container">
              {form.citizenFlag === 'N' ? (
                // For Resident Indian, show a disabled input with IN value
                <input
                  type="text"
                  className="form-input"
                  ref={inputRefs.countryOfRes}
                  value="IN"
                  disabled
                  onKeyDown={(e) => handleKeyDown(e, 'countryOfRes')}
                />
              ) : (
                // For NRI/OCI, show a dropdown with country options
                <select
                  className="form-input"
                  ref={inputRefs.countryOfRes}
                  value={form.countryOfRes}
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
                    handleChange('countryOfRes', v);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, 'countryOfRes')}
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {countryCodes
                    .filter(country => {
                      // For NRI, exclude India and only show countries with NRI flag
                      if (form.citizenFlag === 'Y') {
                        return country.code !== 'IN' && country.nriFlag === 'Y';
                      }
                      // For OCI, include all countries
                      return true;
                    })
                    .map(country => (
                      <option key={country.code} value={country.code}>
                        {country.code} - {country.name}
                      </option>
                    ))}
                </select>
              )}
              {errors.countryOfRes && (
                <span className="error-text">{errors.countryOfRes}</span>
              )}
            </div>
          </div>

          {/* Nationality */}
          <div className={`form-field${errors.nationality ? ' has-error' : ''}`}>
            <label className="form-label">
              Nationality <span className="required">*</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                ref={inputRefs.nationality}
                value={form.nationality}
                onChange={(e) => {
                  const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
                  handleChange('nationality', v);
                }}
                onKeyDown={(e) => handleKeyDown(e, 'nationality')}
                maxLength={3}
                placeholder="3 character country code"
              />
              {errors.nationality && (
                <span className="error-text">{errors.nationality}</span>
              )}
            </div>
          </div>

          {/* Consent By POP */}
          <div className={`form-field${errors.consentByPOP ? ' has-error' : ''}`}>
            <label className="form-label">
              Consent By POP <span className="required">*</span>
            </label>
            <div className="input-container">
              <select
                className="form-input"
                ref={inputRefs.consentByPOP}
                value={form.consentByPOP}
                onChange={(e) => handleChange('consentByPOP', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'consentByPOP')}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
              {errors.consentByPOP && (
                <span className="error-text">{errors.consentByPOP}</span>
              )}
            </div>
          </div>

          {/* How Did You Hear About NPS */}
          <div className={`form-field${errors.howDidYouHearAboutNPS ? ' has-error' : ''}`}>
            <label className="form-label">How Did You Hear About NPS</label>
            <div className="input-container">
              <select
                className="form-input"
                ref={inputRefs.howDidYouHearAboutNPS}
                value={form.howDidYouHearAboutNPS}
                onChange={(e) =>
                  handleChange('howDidYouHearAboutNPS', e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, 'howDidYouHearAboutNPS')}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="01">Friend/Family</option>
                <option value="02">Social Media</option>
                <option value="03">Newspaper/Magazines</option>
                <option value="04">TV/Radio</option>
                <option value="05">Financial Advisor/Apps</option>
                <option value="06">Employer</option>
              </select>
              {errors.howDidYouHearAboutNPS && (
                <span className="error-text">{errors.howDidYouHearAboutNPS}</span>
              )}
            </div>
          </div>

          {/* Min Upload Indicator */}
          <div className={`form-field${errors.minUploadIndicator ? ' has-error' : ''}`}>
            <label className="form-label">
              Min Upload Indicator <span className="required">*</span>
            </label>
            <div className="input-container">
              <select
                className="form-input"
                ref={inputRefs.minUploadIndicator}
                value={form.minUploadIndicator}
                onChange={(e) => handleChange('minUploadIndicator', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'minUploadIndicator')}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="0">0 - Minimum data upload</option>
                <option value="1">1 - Full data upload with photo sig</option>
                <option value="2">2 - Full data upload without photo sig</option>
                <option value="3">3 - Update for minimum data upload</option>
                <option value="4">4 - New registration without PRAN</option>
              </select>
              {errors.minUploadIndicator && (
                <span className="error-text">{errors.minUploadIndicator}</span>
              )}
            </div>
          </div>

          {/* Pregenerated Pran Flag */}
          <div className={`form-field${errors.pregeneratedPranFlag ? ' has-error' : ''}`}>
            <label className="form-label">
              Pregenerated Pran Flag <span className="required">*</span>
            </label>
            <div className="input-container">
              <select
                className="form-input"
                ref={inputRefs.pregeneratedPranFlag}
                value={form.pregeneratedPranFlag}
                onChange={(e) => handleChange('pregeneratedPranFlag', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'pregeneratedPranFlag')}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="I">I - Initial registration with pre-generated PRAN</option>
                <option value="M">M - Modification</option>
                <option value="N">N - Initial registration without pre-generated PRAN</option>
              </select>
              {errors.pregeneratedPranFlag && (
                <span className="error-text">{errors.pregeneratedPranFlag}</span>
              )}
            </div>
          </div>

          {/* Existing Customer Flag */}
          <div className={`form-field${errors.existingCustomerFlag ? ' has-error' : ''}`}>
            <label className="form-label">Existing Customer Flag</label>
            <div className="input-container">
              <select
                className="form-input"
                ref={inputRefs.existingCustomerFlag}
                value={form.existingCustomerFlag}
                onChange={(e) => handleChange('existingCustomerFlag', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'existingCustomerFlag')}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="A">A - Aadhar based</option>
                <option value="B">B - PAN based</option>
                <option value="N">N - Non-existing customer</option>
                <option value="O">O - Existing customer for other product</option>
              </select>
              {errors.existingCustomerFlag && (
                <span className="error-text">{errors.existingCustomerFlag}</span>
              )}
            </div>
          </div>

          {/* Product Existing Customer */}
          <div className={`form-field${errors.productExistingCustomer ? ' has-error' : ''}`}>
            <label className="form-label">
              Product Existing Customer {form.existingCustomerFlag && ['B', 'O'].includes(form.existingCustomerFlag) && <span className="required">*</span>}
            </label>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                ref={inputRefs.productExistingCustomer}
                value={form.productExistingCustomer}
                onChange={(e) =>
                  handleChange('productExistingCustomer', e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, 'productExistingCustomer')}
                maxLength={50}
                placeholder="Product number (up to 50 characters)"
              />
              {errors.productExistingCustomer && (
                <span className="error-text">{errors.productExistingCustomer}</span>
              )}
            </div>
          </div>

          {/* Existing Customer BranchOffice */}
          <div className={`form-field${errors.existingCustomerBranchOffice ? ' has-error' : ''}`}>
            <label className="form-label">
              Existing Customer BranchOffice {form.existingCustomerFlag && ['B', 'O'].includes(form.existingCustomerFlag) && <span className="required">*</span>}
            </label>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                ref={inputRefs.existingCustomerBranchOffice}
                value={form.existingCustomerBranchOffice}
                onChange={(e) =>
                  handleChange('existingCustomerBranchOffice', e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, 'existingCustomerBranchOffice')}
                maxLength={105}
                placeholder="Branch office (up to 105 characters)"
              />
              {errors.existingCustomerBranchOffice && (
                <span className="error-text">{errors.existingCustomerBranchOffice}</span>
              )}
            </div>
          </div>

          {/* Pop Se Code */}
          <div className={`form-field${errors.popSeCode ? ' has-error' : ''}`}>
            <label className="form-label">Pop Se Code</label>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                ref={inputRefs.popSeCode}
                value={form.popSeCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 13);
                  handleChange('popSeCode', v);
                }}
                onKeyDown={(e) => handleKeyDown(e, 'popSeCode')}
                maxLength={13}
                placeholder="Alphanumeric (up to 13 characters)"
              />
              {errors.popSeCode && (
                <span className="error-text">{errors.popSeCode}</span>
              )}
            </div>
          </div>

          {/* PopSe Agent Name */}
          <div className={`form-field${errors.popSeAgentName ? ' has-error' : ''}`}>
            <label className="form-label">PopSe Agent Name</label>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                ref={inputRefs.popSeAgentName}
                value={form.popSeAgentName}
                onChange={(e) =>
                  handleChange('popSeAgentName', e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, 'popSeAgentName')}
                maxLength={90}
                placeholder="Agent name (up to 90 characters)"
              />
              {errors.popSeAgentName && (
                <span className="error-text">{errors.popSeAgentName}</span>
              )}
            </div>
          </div>

          {/* PopSe Employee Id */}
          <div className={`form-field${errors.popSeEmployeeId ? ' has-error' : ''}`}>
            <label className="form-label">PopSe Employee Id</label>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                ref={inputRefs.popSeEmployeeId}
                value={form.popSeEmployeeId}
                onChange={(e) =>
                  handleChange('popSeEmployeeId', e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, 'popSeEmployeeId')}
                maxLength={16}
                placeholder="Employee ID (up to 16 characters)"
              />
              {errors.popSeEmployeeId && (
                <span className="error-text">{errors.popSeEmployeeId}</span>
              )}
            </div>
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