import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SchemeSelection.css";

const SchemeSelection = () => {
  const navigate = useNavigate();

  // ---------- FORM STATE ----------
  const [schemeOption, setSchemeOption] = useState(""); // 'auto' or 'active'
  const [lifeCycleFund, setLifeCycleFund] = useState("");
  const [funds, setFunds] = useState([
    { type: "Equity", percentage: "" },
    { type: "Corporate Bonds", percentage: "" },
    { type: "Government Securities", percentage: "" },
  ]);
  const [pmfNumber, setPmfNumber] = useState("");
  const [errors, setErrors] = useState({});

  // ---------- REAL-TIME TOTAL ----------
  const totalPercentage = funds.reduce((sum, fund) => {
    const val = parseFloat(fund.percentage) || 0;
    return sum + val;
  }, 0);

  // ---------- INPUT HANDLER ----------
  const handleFundChange = (index, value) => {
    let input = value.trim();
    input = input.replace(/[^0-9.]/g, "");

    const parts = input.split(".");
    if (parts.length > 2) {
      input = parts[0] + "." + parts.slice(1).join("");
    }

    if (input.includes(".")) {
      const [intPart, decPart] = input.split(".");

      if (decPart) {
        if (!decPart.startsWith("5")) {
          input = intPart;
        } else if (decPart === "5" || decPart === "50") {
          input = intPart + (decPart === "50" ? ".50" : ".5");
        } else {
          if (decPart.length === 1 && decPart === "5") {
            input = intPart + ".5";
          } else {
            input = intPart + ".50";
          }
        }
      }
    }

    if (input && parseFloat(input) > 100) {
      input = "100";
    }

    if (input.startsWith("0") && input !== "0" && !input.startsWith("0.")) {
      input = input.replace(/^0+/, "");
    }

    if (input.length > 6) return;

    const newFunds = [...funds];
    newFunds[index].percentage = input;
    setFunds(newFunds);
  };

  // ---------- VALIDATION ----------
  const validateAll = useCallback(() => {
    const newErr = {};

    if (!schemeOption) {
      newErr.schemeOption = "Please select an investment option";
    }

    if (schemeOption === "auto" && !lifeCycleFund) {
      newErr.lifeCycleFund = "Please select a Life Cycle Fund";
    }

    if (schemeOption === "active") {
      if (!pmfNumber.trim()) {
        newErr.pmfNumber = "PMF Number is required";
      }

      funds.forEach((fund, idx) => {
        const val = fund.percentage;
        const num = parseFloat(val);

        if (!val || val === "" || val === ".") {
          newErr[`fund_${idx}`] = "Percentage is required";
        } else if (isNaN(num) || num <= 0) {
          newErr[`fund_${idx}`] = "Percentage cannot be 0";
        } else if (num > 100) {
          newErr[`fund_${idx}`] = "Percentage cannot exceed 100";
        } else if (val.includes(".")) {
          const decimal = val.split(".")[1];
          if (!["5", "50"].includes(decimal)) {
            newErr[`fund_${idx}`] =
              "Only .5 or .50 allowed (e.g., 33.5 or 33.50)";
          }
        }
      });

      if (Math.abs(totalPercentage - 100) > 0.001) {
        newErr.total = "Total percentage must be exactly 100%";
      }
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  }, [schemeOption, lifeCycleFund, pmfNumber, funds, totalPercentage]);

  useEffect(() => {
    validateAll();
  }, [validateAll]);

  // ---------- OUTPUT JSON ----------
  const getOutputJSON = () => ({
    schemeOption,
    lifeCycleFund: schemeOption === "auto" ? lifeCycleFund : null,
    pmfNumber: schemeOption === "active" ? pmfNumber : null,
    fundAllocations: schemeOption === "active" ? funds : null,
  });

  // ---------- BUTTON HANDLERS ----------
  const handleNext = () => {
    if (validateAll()) {
      const payload = getOutputJSON();
      localStorage.setItem("schemeDetails", JSON.stringify(payload));
      navigate("/registration/nomination");
    }
  };

  const handleBack = () => {
    navigate("/registration/employment");
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
    <div className="app-main" onKeyDown={handleKeyDown}>
      <section className="form-card">
        <h2>Registration – Scheme Selection</h2>

        <div className="form-section">
          <h3>Investment Scheme (Tier 1)</h3>

          {/* Scheme Option */}
          <div className="form-field">
            <span className="form-label">
              Choose your investment option <span className="required">*</span>
            </span>

            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="schemeOption"
                  value="auto"
                  checked={schemeOption === "auto"}
                  onChange={() => setSchemeOption("auto")}
                />
                <span>Auto Choice</span>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="schemeOption"
                  value="active"
                  checked={schemeOption === "active"}
                  onChange={() => setSchemeOption("active")}
                />
                <span>Active Choice</span>
              </label>
            </div>

            {errors.schemeOption && (
              <span className="error-text">{errors.schemeOption}</span>
            )}
          </div>

          {/* Auto Choice */}
          {schemeOption === "auto" && (
            <div className="conditional-section">
              <h4>Auto Choice</h4>

              <label
                className={`form-field ${
                  errors.lifeCycleFund ? "has-error" : ""
                }`}
              >
                <span className="form-label">Select Life Cycle Fund</span>

                <select
                  className="form-input"
                  value={lifeCycleFund}
                  onChange={(e) => setLifeCycleFund(e.target.value)}
                >
                  <option value="" disabled>
                    Select Fund
                  </option>
                  <option value="B">B - Balanced Life Cycle</option>
                  <option value="A">A - Aggressive Life Cycle</option>
                  <option value="C">C - Conservative Life Cycle</option>
                </select>

                {errors.lifeCycleFund && (
                  <span className="error-text">{errors.lifeCycleFund}</span>
                )}
              </label>

              <p className="info-text">
                This choice will automatically allocate your funds across E, C,
                G.
              </p>
            </div>
          )}

          {/* Active Choice */}
          {schemeOption === "active" && (
            <div className="conditional-section">
              <h4>Active Choice</h4>

              {/* PMF Number */}
              <label
                className={`form-field ${
                  errors.pmfNumber ? "has-error" : ""
                }`}
              >
                <span className="form-label">
                  PMF Number <span className="required">*</span>
                </span>

                <input
                  type="text"
                  className="form-input"
                  value={pmfNumber}
                  onChange={(e) => {
                    let value = e.target.value.toUpperCase();
                    value = value.replace(/[^A-Z0-9]/gi, "");
                    if (value.length > 6) value = value.slice(0, 6);
                    setPmfNumber(value);
                  }}
                  placeholder="e.g. FH3H3R"
                  maxLength={6}
                  style={{ textTransform: "uppercase" }}
                />

                <div style={{ fontSize: "11px", color: "#666" }}>
                  Exactly 6 characters (letters & numbers only)
                </div>

                {errors.pmfNumber && (
                  <span className="error-text">{errors.pmfNumber}</span>
                )}
              </label>

              {/* Fund Allocation Table */}
              <div className="fund-table">
                <div className="table-header">
                  <span>FUND TYPE</span>
                  <span>PERCENTAGE %</span>
                </div>

                {funds.map((fund, idx) => (
                  <div key={idx} className="table-row">
                    <input
                      type="text"
                      value={fund.type}
                      readOnly
                      className="form-input readonly"
                    />

                    <label
                      className={`form-field ${
                        errors[`fund_${idx}`] ? "has-error" : ""
                      }`}
                    >
                      <input
                        type="text"
                        className="form-input"
                        value={fund.percentage}
                        onChange={(e) =>
                          handleFundChange(idx, e.target.value)
                        }
                        placeholder="e.g. 65.50"
                        maxLength={6}
                      />

                      {errors[`fund_${idx}`] && (
                        <span className="error-text">
                          {errors[`fund_${idx}`]}
                        </span>
                      )}

                      <small style={{ color: "#666", fontSize: "11px" }}>
                        Only .5 or .50 allowed after decimal
                      </small>
                    </label>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="total-row">
                <span>
                  Total:{" "}
                  <strong
                    style={{
                      color: totalPercentage === 100 ? "green" : "red",
                    }}
                  >
                    {totalPercentage.toFixed(2)}%
                  </strong>
                </span>

                {errors.total && (
                  <span className="error-text">{errors.total}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="action-button secondary"
            onClick={handleBack}
          >
            Back
          </button>

          <button
            type="button"
            className={`action-button ${
              Object.keys(errors).length > 0 ||
              !schemeOption ||
              (schemeOption === "auto" && !lifeCycleFund) ||
              (schemeOption === "active" &&
                (totalPercentage !== 100 || !pmfNumber.trim()))
                ? "disabled"
                : "primary"
            }`}
            onClick={handleNext}
            disabled={
              Object.keys(errors).length > 0 ||
              !schemeOption ||
              (schemeOption === "auto" && !lifeCycleFund) ||
              (schemeOption === "active" &&
                (totalPercentage !== 100 || !pmfNumber.trim()))
            }
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default SchemeSelection;
