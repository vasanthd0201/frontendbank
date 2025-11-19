import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PhotoSignatureForm.css';

const PhotoSignatureForm = () => {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [form60, setForm60] = useState(null);
  const [evidence, setEvidence] = useState('');
  const [relinquish1, setRelinquish1] = useState('');
  const [relinquish2, setRelinquish2] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  const photoInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const form60InputRef = useRef(null);

  
  const validateFile = (file, field) => {
    if (!file) return true;

    const isJpeg = file.type === 'image/jpeg';
    const sizeInKB = file.size / 1024;
    const isSizeValid = sizeInKB >= 4 && sizeInKB <= 24;

    if (!isJpeg || !isSizeValid) {
      setErrors(prev => ({
        ...prev,
        [field]: isJpeg ? 'File must be 4–12 KB' : 'Only JPEG allowed'
      }));
      return false;
    }

    setErrors(prev => {
      const newErr = { ...prev };
      delete newErr[field];
      return newErr;
    });
    return true;
  };

  const handleFileChange = (e, setter, field) => {
    const file = e.target.files[0];
    if (file && validateFile(file, field)) {
      setter(file);
    } else {
      setter(null);
      e.target.value = '';
    }
  };

  const handleRemoveFile = (setter, field, inputRef) => {
    setter(null);
    setErrors(prev => {
      const newErr = { ...prev };
      delete newErr[field];
      return newErr;
    });
    if (inputRef.current) inputRef.current.value = '';
  };

  const validateAll = () => {
    const newErr = {};

    if (!photo) newErr.photo = 'Photograph is required';
    if (!signature) newErr.signature = 'Signature is required';
    if (!agree) newErr.agree = 'You must agree to the declaration';

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      const payload = {
        photo: photo?.name || null,
        signature: signature?.name || null,
        form60: form60?.name || null,
        evidence,
        relinquish1,
        relinquish2,
        agree
      };
      localStorage.setItem('uploadDetails', JSON.stringify(payload));
      alert('Application Submitted Successfully!');

    }
  };

  const handleBack = () => {
    navigate('/registration/nomination');
  };
  const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const form = e.target.closest("form");
    const inputs = Array.from(
      form.querySelectorAll(
        "input:not([type='hidden']), select, textarea, button"
      )
    );

    const index = inputs.indexOf(e.target);
    const next = inputs[index + 1];

    if (next) {
      next.focus();
    }
  }
};


  return (
    <div className="app-main">
      <section className="form-card">
        <h2>Registration – Upload Photo & Signature</h2>

        <form onSubmit={handleSubmit} className="upload-form" onKeyDown={handleKeyDown}>

          <div className="upload-grid">
            <div className={`upload-field${errors.photo ? ' has-error' : ''}`}>
              <label className="form-label">
                Upload Photograph <span className="required">*</span>
              </label>
              <div className="upload-area">
                {photo ? (
                  <div className="file-preview">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Photograph"
                      className="preview-img"
                    />
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(setPhoto, 'photo', photoInputRef)}
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    + Upload Photo
                  </button>
                )}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg"
                  onChange={(e) => handleFileChange(e, setPhoto, 'photo')}
                  hidden
                />
              </div>
              <p className="file-note">JPEG only, 4–12 KB</p>
              {errors.photo && <span className="error-text">{errors.photo}</span>}
            </div>

            {/* Signature */}
            <div className={`upload-field${errors.signature ? ' has-error' : ''}`}>
              <label className="form-label">
                Upload Signature <span className="required">*</span>
              </label>
              <div className="upload-area">
                {signature ? (
                  <div className="file-preview">
                    <img
                      src={URL.createObjectURL(signature)}
                      alt="Signature"
                      className="preview-img"
                    />
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(setSignature, 'signature', signatureInputRef)}
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => signatureInputRef.current?.click()}
                  >
                    + Upload Signature
                  </button>
                )}
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/jpeg"
                  onChange={(e) => handleFileChange(e, setSignature, 'signature')}
                  hidden
                />
              </div>
              <p className="file-note">JPEG only, 4–12 KB</p>
              {errors.signature && <span className="error-text">{errors.signature}</span>}
            </div>

            {/* Form 60 */}
            <div className="upload-field">
              <label className="form-label">Form 60 Document</label>
              <div className="upload-area">
                {form60 ? (
                  <div className="file-preview">
                    <span className="file-name">{form60.name}</span>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(setForm60, 'form60', form60InputRef)}
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => form60InputRef.current?.click()}
                  >
                    + Upload Form 60
                  </button>
                )}
                <input
                  ref={form60InputRef}
                  type="file"
                  onChange={(e) => handleFileChange(e, setForm60, 'form60')}
                  hidden
                />
              </div>
              <p className="file-note">Optional</p>
            </div>

          </div>

          {/* Text Fields */}
          <div className="form-grid">

            <label className="form-field">
              <span className="form-label">Evidence Orphan (optional)</span>
              <input
                type="text"
                className="form-input"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Enter details"
              />
            </label>

            <label className="form-field">
              <span className="form-label">Relinquish Citizen 1</span>
              <input
                type="text"
                className="form-input"
                value={relinquish1}
                onChange={(e) => setRelinquish1(e.target.value)}
                placeholder="Enter details"
              />
            </label>

            <label className="form-field">
              <span className="form-label">Relinquish Citizen 2</span>
              <input
                type="text"
                className="form-input"
                value={relinquish2}
                onChange={(e) => setRelinquish2(e.target.value)}
                placeholder="Enter details"
              />
            </label>

          </div>

          {/* Declaration */}
          <div className={`form-field${errors.agree ? ' has-error' : ''}`}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              <span className="checkmark"></span>
              <span className="declaration-text">
                I hereby declare that the information provided is true and accurate.
              </span>
            </label>
            {errors.agree && <span className="error-text">{errors.agree}</span>}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" className="action-button secondary" onClick={handleBack}>
              Back
            </button>
            <button
              type="submit"
              className={`action-button${
                !photo || !signature || !agree || Object.keys(errors).length > 0
                  ? ' disabled' : ' primary'
              }`}
              disabled={!photo || !signature || !agree || Object.keys(errors).length > 0}
            >
              Submit Application
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default PhotoSignatureForm;