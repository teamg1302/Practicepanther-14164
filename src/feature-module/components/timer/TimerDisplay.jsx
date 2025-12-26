import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

/**
 * Global Timer Display Component
 * Displays the total time from Redux store
 * Can be used in any component or page
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @returns {JSX.Element} Timer display component
 */
const TimerDisplay = ({ className = "", style = {} }) => {
  const totalTime = useSelector((state) => state.timer?.totalTime || "00:00:00");

  return (
    <div className={className} style={style}>
      <span className="text-dark fs-2">{totalTime}</span>
    </div>
  );
};

TimerDisplay.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default TimerDisplay;

