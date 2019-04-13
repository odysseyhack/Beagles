import React from "react";
import PropTypes from "prop-types";

const FormInput = ({ name, value, onChange }) => {
  return (
    <div className="form-group">
      <label>{name}:</label>
      <input
        className="form-control"
        name={name}
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
};

export default FormInput;
