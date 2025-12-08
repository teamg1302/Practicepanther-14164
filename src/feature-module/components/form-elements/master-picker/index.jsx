import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import Select from "../select";

const MasterPicker = ({
  name,
  label,
  action,
  clearError,
  dataKey,
  ...rest
}) => {
  const { data, loading, error } = useSelector(
    (state) => state.masters[dataKey]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!loading && !data) {
      dispatch(action());
    }
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, action, data, loading, dataKey, error, clearError]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!data) {
    return <div>No data found</div>;
  }

  return <Select name={name} label={label} options={data} {...rest} />;
};
MasterPicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  master: PropTypes.object.isRequired,
  ...Select.propTypes,
};
export default MasterPicker;
