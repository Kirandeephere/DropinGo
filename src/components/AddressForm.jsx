import React, { useState, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

const AddressForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [errors, setErrors] = useState({ origin: false, destination: false, sameAddress: false });
  const [swap, setSwap] = useState(false); // New state to track the swap

  const originRef = useRef(null);
  const destinationRef = useRef(null);

  const handleReset = () => {
    originRef.current.value = "";
    destinationRef.current.value = "";
    setErrors({ origin: false, destination: false, sameAddress: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const origin = originRef.current?.value || "";
    const destination = destinationRef.current?.value || "";

    const newErrors = {
      origin: !origin.trim(),
      destination: !destination.trim(),
      sameAddress: origin.trim().toLowerCase() === destination.trim().toLowerCase(),
    };

    setErrors(newErrors);

    if (newErrors.origin || newErrors.destination || newErrors.sameAddress) {
      return;
    }

    onSubmit({ origin, destination });
  };

  const handleCancel = () => {
    onCancel();
    handleReset();
  };

  // Style helper for conditional error border
  const getInputStyle = (hasError) => ({
    display: 'block',
    width: '100%',
    marginBottom: '1rem',
    border: hasError ? '1px solid red' : '1px solid #ccc',
    padding: '0.5rem',
    borderRadius: '4px',
  });

  // Function to handle swapping values
  const handleSwap = () => {
    const originValue = originRef.current.value;
    const destinationValue = destinationRef.current.value;

    originRef.current.value = destinationValue;
    destinationRef.current.value = originValue;

    setSwap(!swap); // Toggle swap state
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      
      {/* Pickup address input with Google Autocomplete */}
      <div>
        <label>🚏 Pickup Address:</label>
        <Autocomplete>
          <input
            type="text"
            ref={originRef}
            placeholder="e.g. Innocentre, Hong Kong"
            style={getInputStyle(errors.origin)}
          />
        </Autocomplete>
      </div>

      {/* Drop-off address input with Google Autocomplete */}
      <div>
        <label>🎯 Drop-off Address:</label>
        <Autocomplete>
          <input
            type="text"
            ref={destinationRef}
            placeholder="e.g. Hong Kong International Airport Terminal 1"
            style={getInputStyle(errors.destination)}
          />
        </Autocomplete>
      </div>


      {/* Error message for same address */}
      {errors.sameAddress && (
        <p style={{ color: "red", marginBottom: '1rem' }}>
          Pickup and drop-off addresses cannot be the same.
        </p>
      )}

      {/* General error message for required fields */}
      {(errors.origin || errors.destination) && (
        <p style={{ color: "red", marginBottom: '1rem' }}>Both addresses are required.</p>
      )}

      <div className="button-container">
        {/* Swap icon button */}
        <button type="submit" disabled={isSubmitting}>
          Get Route
        </button>
        <button
          type="button"
          onClick={isSubmitting ? handleCancel : handleReset}
        >
          {isSubmitting ? "Cancel" : "Reset"}
        </button>
              <button type="button" onClick={handleSwap} style={{background: 'grey' }}>
        🔄 Swap Addresses
      </button>
      </div>
    </form>
  );
};

export default AddressForm;
