import React from "react";
import FormButton from "./FormButton";
import PropTypes from "prop-types";

const FromButtonGroup = ({ isSubmitting, reset, onClick }) => {
  return (
    <div className="col-lg-12 border-top py-4">
      <div className="d-flex justify-content-end gap-2">
        <FormButton
          type="submit"
          onClick={onClick}
          isSubmitting={isSubmitting}
        />
        <FormButton type="save" onClick={onClick} isSubmitting={isSubmitting} />
        <FormButton
          type="cancel"
          isSubmitting={isSubmitting}
          onClick={() => reset()}
        />
      </div>
    </div>
  );
};

FromButtonGroup.propTypes = {
  isSubmitting: PropTypes.bool,
  reset: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

export default FromButtonGroup;
