import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PauseOutlined, TimerOutlined } from "@mui/icons-material";
import {
  setTimerTotalTime,
  setTimerRunning,
  setTimerStartTime,
  setTimerPausedElapsed,
} from "@/core/redux/action";
import { StandardButton } from "@/feature-module/components/buttons";
import PropTypes from "prop-types";

/**
 * Formats time in HH:MM:SS format
 * @param {number} totalSeconds - Total seconds to format
 * @returns {string} Formatted time string
 */
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

/**
 * Parses time string (HH:MM:SS) to total seconds
 * @param {string} timeString - Time string to parse
 * @returns {number} Total seconds
 */
const parseTimeToSeconds = (timeString) => {
  if (!timeString || timeString === "00:00:00") return 0;
  const parts = timeString.split(":");
  if (parts.length !== 3) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parseInt(parts[2], 10) || 0;
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Global Start Timer Button Component
 * Handles timer start/stop functionality using Redux
 * Can be used in any component or page
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {string} props.label - Custom button label
 * @returns {JSX.Element} Start timer button component
 */
const StartTimerButton = ({ className = "", style = {}, label }) => {
  const dispatch = useDispatch();
  const timerRunning = useSelector((state) => state.timer?.timerRunning || false);
  const totalTime = useSelector((state) => state.timer?.totalTime || "00:00:00");
  const startTimeString = useSelector((state) => state.timer?.startTime);
  // Convert ISO string back to Date object for calculations
  const startTime = startTimeString ? new Date(startTimeString) : null;
  const pausedElapsed = useSelector((state) => state.timer?.pausedElapsed || 0);

  const intervalRef = useRef(null);

  /**
   * Handles timer start/pause
   */
  const handleStartTimer = () => {
    if (timerRunning) {
      // Timer is running, pause it
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Calculate elapsed time and add to paused elapsed
      if (startTime) {
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000);
        const newPausedElapsed = pausedElapsed + elapsed;

        // Update totalTime with accumulated time
        const formattedTime = formatTime(newPausedElapsed);
        dispatch(setTimerTotalTime(formattedTime));
        dispatch(setTimerPausedElapsed(newPausedElapsed));
      }

      dispatch(setTimerRunning(false));
      dispatch(setTimerStartTime(null));
    } else {
      // Start or resume the timer from last paused time
      // Get current totalTime and convert to seconds
      const currentSeconds = parseTimeToSeconds(totalTime);
      dispatch(setTimerPausedElapsed(currentSeconds));

      const now = new Date();
      dispatch(setTimerStartTime(now));
      dispatch(setTimerRunning(true));
    }
  };

  // Update timer display when running
  useEffect(() => {
    if (timerRunning && startTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000);
        const totalElapsed = pausedElapsed + elapsed;
        const formattedTime = formatTime(totalElapsed);
        dispatch(setTimerTotalTime(formattedTime));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerRunning, startTimeString, pausedElapsed, dispatch]);

  const buttonLabel = label || (timerRunning ? "Pause Timer" : "Start Timer");

  return (
    <div className={className} style={style}>
      <StandardButton
        label={buttonLabel}
        style={{
          height: "40px !important",
          marginTop: "10px",
          ...style,
        }}
        onClick={handleStartTimer}
        icon={
          timerRunning ? (
            <PauseOutlined fontSize="small" />
          ) : (
            <TimerOutlined fontSize="small" />
          )
        }
      />
    </div>
  );
};

StartTimerButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.string,
};

export default StartTimerButton;

